const assert = require('node:assert/strict');
const path = require('node:path');
const build = process.env.UNMUTE_TEST_BUILD || path.join(__dirname, '.build');
const { persistProjectTranscript } = require(path.join(build, 'lib/project-persistence.js'));
const { loadCloudTranscript } = require(path.join(build, 'lib/cloud-transcript.js'));

(async () => {
  let checks = 0;
  const equal = (actual, expected) => { assert.deepEqual(actual, expected); checks++; };
  const input = { title: 'Saved recording.mp4', sourceType: 'upload', duration: 5,
    file: new File(['movie'], 'recording.mp4', { type: 'video/mp4' }), buffer: new Uint8Array([1, 2, 3]),
    segments: [{ start: 0, end: 5, text: 'Hello my friend.' }],
  };
  function fixture(failure) {
    const events = [];
    const client = {
      storage: { from(bucket) {
        equal(bucket, 'media');
        return {
          async upload(key) { events.push(['upload', key]); return { error: failure === 'media' ? new Error('private provider detail') : null }; },
          getPublicUrl(key) { return { data: { publicUrl: `https://storage.test/${key}` } }; },
          async remove(keys) { events.push(['remove', keys]); return { error: null }; },
        };
      } },
      from(table) {
        return {
          insert(rows) {
            events.push(['insert', table, rows]);
            if (table === 'transcript_segments') return Promise.resolve({ error: failure === 'segments' ? new Error('private detail') : null });
            return { select() { return { async single() { return failure === 'project' ? { data: null, error: new Error('private detail') } : { data: { id: 'new-project' }, error: null }; } }; } };
          },
          delete() {
            const query = { eq(field, value) { events.push(['delete', field, value]); return query; }, then(resolve) { return Promise.resolve({ error: null }).then(resolve); } };
            return query;
          },
        };
      },
    };
    return { client, events };
  }
  let current = fixture();
  let result = await persistProjectTranscript(current.client, 'owner', input);
  equal(result.projectId, 'new-project'); equal(result.persistenceWarning, undefined);
  equal(result.sourceUrl.startsWith('https://storage.test/owner/'), true);
  equal(current.events.filter(event => event[0] === 'remove').length, 0);
  current = fixture('media');
  result = await persistProjectTranscript(current.client, 'owner', input);
  equal(result.projectId, 'new-project'); equal(result.sourceUrl, null);
  equal(result.persistenceWarning.includes('media upload failed'), true);
  equal(current.events.some(event => event[0] === 'insert' && event[1] === 'transcript_segments'), true);
  for (const failure of ['project', 'segments']) {
    current = fixture(failure);
    result = await persistProjectTranscript(current.client, 'owner', input);
    equal(result.projectId, null); equal(result.sourceUrl, null);
    equal(result.persistenceWarning.includes('private'), false);
    equal(current.events.filter(event => event[0] === 'remove').length, 1);
    equal(current.events.some(event => event[0] === 'delete' && event[1] === 'id' && event[2] === 'new-project'), failure === 'segments');
    equal(current.events.some(event => event[0] === 'delete' && event[1] === 'user_id' && event[2] === 'owner'), failure === 'segments');
  }
  current = fixture('project');
  result = await persistProjectTranscript(current.client, 'owner', { ...input, file: undefined, buffer: undefined, sourceType: 'youtube', sourceUrl: 'https://youtu.be/abcdefghijk' });
  equal(result.sourceUrl, 'https://youtu.be/abcdefghijk');
  equal(current.events.some(event => event[0] === 'remove'), false);

  const rows = Array.from({ length: 1003 }, (_, index) => ({ id: String(index), start_time: index, end_time: index + 1, original_text: `Caption ${index}`, edited_text: index === 1002 ? '' : null }));
  const ranges = [];
  const query = { select() { return query; }, eq(column, value) { equal([column, value], ['project_id', 'owned-project']); return query; }, order() { return query; }, async range(start, end) { ranges.push([start, end]); return { data: rows.slice(start, end + 1), error: null }; } };
  const restored = await loadCloudTranscript({ from: () => query }, 'owned-project');
  equal(restored.length, 1003); equal(restored.at(-1).edited_text, '');
  equal(ranges, [[0, 999], [1000, 1999]]);
  query.range = async () => ({ data: null, error: new Error('private database error') });
  await assert.rejects(loadCloudTranscript({ from: () => query }, 'owned-project'), error => error.message === 'The saved transcript could not be loaded. Please retry this track.'); checks++;
  console.log(`Cloud upload persistence, cleanup and complete transcript restore: ${checks} passed`);
})().catch(error => { console.error(error); process.exitCode = 1; });
