import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type McqDraft = {
  prompt: string;
  prompt_ur: string;
  options: [string, string, string, string];
  correct: number;
  advice: string;
};

export const emptyMcq = (): McqDraft => ({
  prompt: "",
  prompt_ur: "",
  options: ["", "", "", ""],
  correct: 0,
  advice: "",
});

export const mcqFromRow = (q: {
  prompt: string;
  prompt_ur: string | null;
  options: unknown;
  correct_index: number;
  advice?: string | null;
}): McqDraft => {
  const o = Array.isArray(q.options) ? (q.options as string[]) : [];
  return {
    prompt: q.prompt,
    prompt_ur: q.prompt_ur ?? "",
    options: [o[0] ?? "", o[1] ?? "", o[2] ?? "", o[3] ?? ""],
    correct: Math.min(Math.max(q.correct_index, 0), 3),
    advice: q.advice ?? "",
  };
};

export function validateMcq(d: McqDraft): string | null {
  if (!d.prompt.trim()) return "Write the question";
  if (d.options.some((o) => !o.trim())) return "Fill in all 4 options";
  return null;
}

export const mcqPayload = (d: McqDraft) => ({
  prompt: d.prompt.trim(),
  prompt_ur: d.prompt_ur.trim() || null,
  options: d.options.map((o) => o.trim()),
  correct_index: d.correct,
  advice: d.advice.trim() || null,
});

const LETTERS = ["1st", "2nd", "3rd", "4th"];

export function McqFields({ value, onChange }: { value: McqDraft; onChange: (d: McqDraft) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Question / سوال</Label>
        <Textarea
          rows={2}
          value={value.prompt}
          onChange={(e) => onChange({ ...value, prompt: e.target.value })}
          placeholder="Type the question here"
        />
        <Input
          className="urdu"
          value={value.prompt_ur}
          onChange={(e) => onChange({ ...value, prompt_ur: e.target.value })}
          placeholder="سوال اردو میں (اختیاری)"
        />
      </div>
      <div className="space-y-2">
        <Label>Options — tick the correct one / درست جواب منتخب کریں</Label>
        {value.options.map((opt, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 rounded-md border p-2 ${
              value.correct === i ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            <input
              type="radio"
              name="mcq-correct"
              aria-label={`Mark ${LETTERS[i]} option correct`}
              checked={value.correct === i}
              onChange={() => onChange({ ...value, correct: i })}
              className="size-4 accent-[var(--color-primary)]"
            />
            <span className="w-10 shrink-0 text-xs font-semibold text-muted-foreground">{LETTERS[i]}</span>
            <Input
              value={opt}
              onChange={(e) => {
                const options = [...value.options] as McqDraft["options"];
                options[i] = e.target.value;
                onChange({ ...value, options });
              }}
              placeholder={`${LETTERS[i]} option`}
            />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Label>Supervisor's advice / نگران کا مشورہ</Label>
        <Textarea
          rows={2}
          value={value.advice}
          onChange={(e) => onChange({ ...value, advice: e.target.value })}
          placeholder="Explanation or advice shown to students after they submit"
        />
      </div>
    </div>
  );
}
