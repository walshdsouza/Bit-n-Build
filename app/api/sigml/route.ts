import { NextRequest, NextResponse } from "next/server";
import { SiGMLResponse } from "@/lib/types";

// Mock SiGML for "WOMAN THINK FOOD"
const MOCK_SIGML = `<?xml version="1.0" encoding="UTF-8"?>
<sigml>
  <!-- GestureSync AI: SiGML generated from ASL Gloss "WOMAN THINK FOOD" -->
  <!-- TODO: Replace with Kozha HamNoSys → SiGML bridge -->
  <!-- Kozha pipeline: gloss[] → HamNoSys string → SiGML XML → CWASA WebGL -->
  <hamgestural_sign>
    <sign_nonmanual facial="wh-question_browDown" head_nod="false"/>
    <hamgesture>
      <!-- WOMAN: Index finger traces jaw line (cheek to chin) -->
      <handconfig handshape="index" thumb="open"/>
      <handlocation location="face_cheek" side="right"/>
      <movement stroke="linear" direction="down" distance="short"/>
    </hamgesture>
    <hamgesture>
      <!-- THINK: Index finger touches temple -->
      <handconfig handshape="index" thumb="closed"/>
      <handlocation location="head_temple" side="right"/>
      <movement stroke="contact" duration="short"/>
    </hamgesture>
    <hamgesture>
      <!-- FOOD: Fingers touch lips repeatedly -->
      <handconfig handshape="open_B" thumb="open"/>
      <handlocation location="mouth" side="dominant"/>
      <movement stroke="repeated" repetitions="2" duration="short"/>
    </hamgesture>
  </hamgestural_sign>
</sigml>`;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { glossRows } = body;

  // TODO: Integrate Kozha HamNoSys bridge:
  // 1. Map each gloss lemma to its HamNoSys string (from a lookup table or LLM)
  // 2. Send to Kozha's /api/hamnosys-to-sigml endpoint
  // 3. Return concatenated SiGML document
  // 
  // Example:
  // const hamnosys = glossToHamNoSys(glossRows);
  // const sigml = await kozhaClient.translate(hamnosys);
  // return NextResponse.json({ sigml });

  await new Promise((r) => setTimeout(r, 400));
  const response: SiGMLResponse = { sigml: MOCK_SIGML };
  return NextResponse.json(response);
}
