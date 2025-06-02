/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@udecode/cn";
import { useState } from "react";

const Tags = ({
  tags,
  setTags,
  isEditable,
}: {
  tags: { id: number; tag: string }[];
  setTags?: any;
  isEditable: boolean;
}) => {
  const [tagInput, setTagInput] = useState("");

  const removeTag = (tag: string) => {
    setTags(tags.filter((tag1) => tag1.tag != tag));
  };

  const addTag = () => {
    setTags([...tags, { tag: tagInput }]);
    setTagInput("");
    console.log(tags);
  };

  if (isEditable)
    return (
      <>
        <div className="">
          <div className="mx-auto mt-6 max-w-lg">
            {/* Tags List */}
            <div className="mb-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag.tag}
                  className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800"
                >
                  {tag.tag}
                  <button
                    onClick={() => removeTag(tag.tag)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                    aria-label={`Remove ${tag.tag}`}
                    type="button"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Input and Button */}
            <div className="flex">
              <input
                type="text"
                className={cn(
                  "border-input flex h-9 w-full rounded-l-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
                  "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
                  "placeholder:text-muted-foreground file:text-foreground selection:bg-primary selection:text-primary-foreground",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
                )}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add a tag and press Enter"
              />
              <button
                onClick={addTag}
                className="h-9 rounded-r-md bg-gray-600 px-4 text-sm text-white hover:bg-gray-700 focus:outline-none"
                type="button"
              >
                Add Tag
              </button>
            </div>
          </div>
        </div>
      </>
    );

  if (tags.length == 0) return <span>No tags found</span>;

  return (
    <>
      <div className="mx-auto mt-6 max-w-lg">
        <div className="mb-3 flex flex-wrap gap-2">
          {tags.map((tag: { id: number; tag: string }) => (
            <span
              key={tag.id}
              className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800"
            >
              {tag.tag}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default Tags;
