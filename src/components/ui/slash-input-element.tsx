/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import * as React from "react";

import type { TSlashInputElement } from "@udecode/plate-slash-command";
import { AIChatPlugin } from "@udecode/plate-ai/react";
import { BlockquotePlugin } from "@udecode/plate-block-quote/react";
import { CalloutPlugin } from "@udecode/plate-callout/react";
import { CodeBlockPlugin } from "@udecode/plate-code-block/react";
import { DatePlugin } from "@udecode/plate-date/react";
import { HEADING_KEYS } from "@udecode/plate-heading";
import { TocPlugin } from "@udecode/plate-heading/react";
import { INDENT_LIST_KEYS, ListStyleType } from "@udecode/plate-indent-list";
import {
  EquationPlugin,
  InlineEquationPlugin,
} from "@udecode/plate-math/react";
import { TablePlugin } from "@udecode/plate-table/react";
import { TogglePlugin } from "@udecode/plate-toggle/react";
import {
  type PlateEditor,
  type PlateElementProps,
  ParagraphPlugin,
  useEditorRef,
} from "@udecode/plate/react";
import { PlateElement } from "@udecode/plate/react";
import {
  CalendarIcon,
  ChevronRightIcon,
  Code2,
  Columns3Icon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ImageIcon,
  LightbulbIcon,
  ListIcon,
  ListOrdered,
  PilcrowIcon,
  Quote,
  RadicalIcon,
  SparklesIcon,
  Square,
  Table,
  TableOfContentsIcon,
  Music,
  Film,
} from "lucide-react";

import {
  insertBlock,
  insertInlineElement,
} from "@/components/editor/transforms";

import {
  InlineCombobox,
  InlineComboboxContent,
  InlineComboboxEmpty,
  InlineComboboxGroup,
  InlineComboboxGroupLabel,
  InlineComboboxInput,
  InlineComboboxItem,
} from "./inline-combobox";

import {
  ImagePlugin,
  AudioPlugin,
  VideoPlugin,
} from "@udecode/plate-media/react";

import { useFilePicker } from "use-file-picker";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import { isUrl } from "@udecode/plate";

export function SlashInputElement(
  props: PlateElementProps<TSlashInputElement>
) {
  const { editor, element } = props;
  const editorRef = useEditorRef();

  // State for each dialog open and url input
  const [imageDialogOpen, setImageDialogOpen] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState("");

  const [audioDialogOpen, setAudioDialogOpen] = React.useState(false);
  const [audioUrl, setAudioUrl] = React.useState("");

  const [videoDialogOpen, setVideoDialogOpen] = React.useState(false);
  const [videoUrl, setVideoUrl] = React.useState("");

  // File pickers for each media type
  const { openFilePicker: openImagePicker } = useFilePicker({
    accept: ["image/*"],
    multiple: true,
    onFilesSelected: ({ plainFiles }: any) => {
      editorRef.getTransforms(ImagePlugin).insert.imageFromFiles(plainFiles);
    },
  });

  const { openFilePicker: openAudioPicker } = useFilePicker({
    accept: ["audio/*"],
    multiple: true,
    onFilesSelected: ({ plainFiles }: any) => {
      editorRef.getTransforms(AudioPlugin).insertData(plainFiles);
    },
  });

  const { openFilePicker: openVideoPicker } = useFilePicker({
    accept: ["video/*"],
    multiple: true,
    onFilesSelected: ({ plainFiles }: any) => {
      editorRef.getTransforms(VideoPlugin).insertData(plainFiles);
    },
  });

  // Handlers to insert URL nodes
  const handleInsertImageUrl = () => {
    if (!isUrl(imageUrl)) return toast.error("Invalid image URL");
    editorRef.tf.insertNodes({
      type: ImagePlugin.key,
      url: imageUrl,
      children: [{ text: "" }],
    });
    setImageUrl("");
    setImageDialogOpen(false);
  };

  const handleInsertAudioUrl = () => {
    if (!isUrl(audioUrl)) return toast.error("Invalid audio URL");
    editorRef.tf.insertNodes({
      type: AudioPlugin.key,
      url: audioUrl,
      children: [{ text: "" }],
    });
    setAudioUrl("");
    setAudioDialogOpen(false);
  };

  const handleInsertVideoUrl = () => {
    if (!isUrl(videoUrl)) return toast.error("Invalid video URL");
    editorRef.tf.insertNodes({
      type: VideoPlugin.key,
      url: videoUrl,
      children: [{ text: "" }],
    });
    setVideoUrl("");
    setVideoDialogOpen(false);
  };

  type Group = {
    group: string;
    items: Item[];
  };

  interface Item {
    icon: React.ReactNode;
    value: string;
    onSelect: (editor: PlateEditor, value: string) => void;
    className?: string;
    focusEditor?: boolean;
    keywords?: string[];
    label?: string;
  }

  const groups: Group[] = [
    {
      group: "AI",
      items: [
        {
          focusEditor: false,
          icon: <SparklesIcon />,
          value: "AI",
          onSelect: (editor) => {
            editor.getApi(AIChatPlugin).aiChat.show();
          },
        },
      ],
    },
    {
      group: "Basic blocks",
      items: [
        {
          icon: <PilcrowIcon />,
          keywords: ["paragraph"],
          label: "Text",
          value: ParagraphPlugin.key,
        },
        {
          icon: <ImageIcon />,
          keywords: ["image"],
          label: "Image",
          value: ImagePlugin.key,
          focusEditor: false,
          onSelect: () => {
            openImagePicker();
            setTimeout(() => setImageDialogOpen(true), 0);
          },
        },
        {
          icon: <Music />,
          keywords: ["audio"],
          label: "Audio",
          value: AudioPlugin.key,
          focusEditor: false,
          onSelect: () => {
            openAudioPicker();
            setTimeout(() => setAudioDialogOpen(true), 0);
          },
        },
        {
          icon: <Film />,
          keywords: ["video"],
          label: "Video",
          value: VideoPlugin.key,
          focusEditor: false,
          onSelect: () => {
            openVideoPicker();
            setTimeout(() => setVideoDialogOpen(true), 0);
          },
        },
        {
          icon: <Heading1Icon />,
          keywords: ["title", "h1"],
          label: "Heading 1",
          value: HEADING_KEYS.h1,
        },
        {
          icon: <Heading2Icon />,
          keywords: ["subtitle", "h2"],
          label: "Heading 2",
          value: HEADING_KEYS.h2,
        },
        {
          icon: <Heading3Icon />,
          keywords: ["subtitle", "h3"],
          label: "Heading 3",
          value: HEADING_KEYS.h3,
        },
        {
          icon: <ListIcon />,
          keywords: ["unordered", "ul", "-"],
          label: "Bulleted list",
          value: ListStyleType.Disc,
        },
        {
          icon: <ListOrdered />,
          keywords: ["ordered", "ol", "1"],
          label: "Numbered list",
          value: ListStyleType.Decimal,
        },
        {
          icon: <Square />,
          keywords: ["checklist", "task", "checkbox", "[]"],
          label: "To-do list",
          value: INDENT_LIST_KEYS.todo,
        },
        {
          icon: <ChevronRightIcon />,
          keywords: ["collapsible", "expandable"],
          label: "Toggle",
          value: TogglePlugin.key,
        },
        {
          icon: <Code2 />,
          keywords: ["```"],
          label: "Code Block",
          value: CodeBlockPlugin.key,
        },
        {
          icon: <Table />,
          label: "Table",
          value: TablePlugin.key,
        },
        {
          icon: <Quote />,
          keywords: ["citation", "blockquote", "quote", ">"],
          label: "Blockquote",
          value: BlockquotePlugin.key,
        },
        {
          description: "Insert a highlighted block.",
          icon: <LightbulbIcon />,
          keywords: ["note"],
          label: "Callout",
          value: CalloutPlugin.key,
        },
      ].map((item) => ({
        ...item,
        onSelect:
          item.onSelect ??
          ((editor, value) => {
            insertBlock(editor, value);
          }),
      })),
    },
    {
      group: "Advanced blocks",
      items: [
        {
          icon: <TableOfContentsIcon />,
          keywords: ["toc"],
          label: "Table of contents",
          value: TocPlugin.key,
        },
        {
          icon: <Columns3Icon />,
          label: "3 columns",
          value: "action_three_columns",
        },
        {
          focusEditor: false,
          icon: <RadicalIcon />,
          label: "Equation",
          value: EquationPlugin.key,
        },
      ].map((item) => ({
        ...item,
        onSelect: (editor, value) => insertBlock(editor, value),
      })),
    },
    {
      group: "Inline",
      items: [
        {
          focusEditor: true,
          icon: <CalendarIcon />,
          keywords: ["time"],
          label: "Date",
          value: DatePlugin.key,
        },
        {
          focusEditor: false,
          icon: <RadicalIcon />,
          label: "Inline Equation",
          value: InlineEquationPlugin.key,
        },
      ].map((item) => ({
        ...item,
        onSelect: (editor, value) => insertInlineElement(editor, value),
      })),
    },
  ];

  return (
    <PlateElement {...props} as="span" data-slate-value={element.value}>
      <InlineCombobox element={element} trigger="/">
        <InlineComboboxInput />
        <InlineComboboxContent>
          <InlineComboboxEmpty>No results</InlineComboboxEmpty>
          {groups.map(({ group, items }) => (
            <InlineComboboxGroup key={group}>
              <InlineComboboxGroupLabel>{group}</InlineComboboxGroupLabel>
              {items.map(
                ({ focusEditor, icon, keywords, label, value, onSelect }) => (
                  <InlineComboboxItem
                    key={value}
                    value={value}
                    onClick={() => onSelect(editor, value)}
                    label={label}
                    focusEditor={focusEditor}
                    group={group}
                    keywords={keywords}
                  >
                    <div className="text-muted-foreground mr-2">{icon}</div>
                    {label ?? value}
                  </InlineComboboxItem>
                )
              )}
            </InlineComboboxGroup>
          ))}
        </InlineComboboxContent>
      </InlineCombobox>

      {/* Image URL dialog */}
      <AlertDialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <AlertDialogContent className="gap-6">
          <AlertDialogHeader>
            <AlertDialogTitle>Insert Image via URL</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            <Input
              type="url"
              placeholder="https://example.com/image.png"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInsertImageUrl()}
              autoFocus
            />
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleInsertImageUrl}>
              Insert
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Audio URL dialog */}
      <AlertDialog open={audioDialogOpen} onOpenChange={setAudioDialogOpen}>
        <AlertDialogContent className="gap-6">
          <AlertDialogHeader>
            <AlertDialogTitle>Insert Audio via URL</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            <Input
              type="url"
              placeholder="https://example.com/audio.mp3"
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInsertAudioUrl()}
              autoFocus
            />
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleInsertAudioUrl}>
              Insert
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Video URL dialog */}
      <AlertDialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <AlertDialogContent className="gap-6">
          <AlertDialogHeader>
            <AlertDialogTitle>Insert Video via URL</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            <Input
              type="url"
              placeholder="https://example.com/video.mp4"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInsertVideoUrl()}
              autoFocus
            />
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleInsertVideoUrl}>
              Insert
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {props.children}
    </PlateElement>
  );
}
