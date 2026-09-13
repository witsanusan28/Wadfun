# Wadfun Icon System

Visual reference locked for the Drawing workspace.

## Drawing tools
- pencil — ดินสอ
- crayon — สีเทียน
- brush — พู่กัน
- marker — ปากกามาร์กเกอร์
- sparkle — ประกาย

## Action tools
- eraser — ยางลบ
- undo — ย้อนกลับ
- redo — ทำซ้ำ
- clear — ล้างทั้งหมด
- save — บันทึก
- share — แชร์
- camera — ถ่ายรูป

## Visual rules
- Kawaii rounded cartoon illustration
- Thick friendly outline
- Bright pastel/glossy surfaces
- Small highlight and soft depth shadow
- Consistent proportions and visual weight
- Never replace the primary tool icons with raw emoji

## States
Each icon is intended to have three UI states:
1. Normal
2. Selected / pressed — blue focus ring and stronger depth
3. Disabled — neutral grayscale treatment

The SVG sprite is the source artwork reference. UI state treatment should be applied by the button component so the underlying drawing/color behavior is not changed.
