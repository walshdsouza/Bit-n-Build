import sys
import json
from youtube_transcript_api import YouTubeTranscriptApi
import codecs

# Force UTF-8 encoding for stdout on Windows
sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())

def get_transcript(video_id, languages=['en']):
    ytt = YouTubeTranscriptApi()
    
    try:
        transcript_list = ytt.list(video_id)
        try:
            transcript = transcript_list.find_transcript(languages)
        except Exception:
            transcript = next(iter(transcript_list))
        data = transcript.fetch()
    except Exception as list_error:
        try:
            data = ytt.fetch(video_id, languages=languages)
        except Exception as fetch_error:
            raise Exception(f"Failed to fetch transcript: {str(fetch_error)}. Captions might be disabled.")

    formatted = []
    for item in data:
        start = float(item.start if hasattr(item, 'start') else item.get('start', 0.0))
        dur = float(item.duration if hasattr(item, 'duration') else item.get('duration', 0.0))
        text = str(item.text if hasattr(item, 'text') else item.get('text', '')).strip()
        
        formatted.append({
            "start": round(start, 2),
            "end": round(start + dur, 2),
            "text": text
        })
    return formatted

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No video ID provided"}))
        sys.exit(0)
        
    vid = sys.argv[1]
    langs = sys.argv[2].split(',') if len(sys.argv) > 2 else ['en']
    
    try:
        res = get_transcript(vid, langs)
        print(json.dumps({"success": True, "segments": res}))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(0)
