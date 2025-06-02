/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client';

import { CalloutPlugin } from '@udecode/plate-callout/react';
import { DatePlugin } from '@udecode/plate-date/react';
import {
  FontBackgroundColorPlugin,
  FontColorPlugin,
  FontSizePlugin,
} from '@udecode/plate-font/react';
import { HighlightPlugin } from '@udecode/plate-highlight/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { KbdPlugin } from '@udecode/plate-kbd/react';
import { ColumnPlugin } from '@udecode/plate-layout/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';

import { alignPlugin } from './plugins/align-plugin';
import { basicNodesPlugins } from './plugins/basic-nodes-plugins';
import { equationPlugins } from './plugins/equation-plugins';
import { indentListPlugins } from './plugins/indent-list-plugins';
import { lineHeightPlugin } from './plugins/line-height-plugin';
import { linkPlugin } from './plugins/link-plugin';
import { mediaPlugins } from './plugins/media-plugins';
import { mentionPlugin } from './plugins/mention-plugin';
import { tablePlugin } from './plugins/table-plugin';
import { tocPlugin } from './plugins/toc-plugin';
import { skipMarkPlugin } from './plugins/skip-mark-plugin';
import { LinkPlugin } from '@udecode/plate-link/react';
import { MentionPlugin } from '@udecode/plate-mention/react';
import { TablePlugin } from '@udecode/plate-table/react';
import { HeadingPlugin, TocPlugin } from '@udecode/plate-heading/react';
import { AudioPlugin, FilePlugin, ImagePlugin, MediaEmbedPlugin, VideoPlugin } from '@udecode/plate-media/react';
import { BasicMarksPlugin, SkipMarkPlugin } from '@udecode/plate-basic-marks/react';
import { AlignPlugin } from '@udecode/plate-alignment/react';
import { LineHeightPlugin } from '@udecode/plate-line-height/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
import { IndentListPlugin } from '@udecode/plate-indent-list/react';
import { HEADING_LEVELS } from '@udecode/plate-heading';
import { IndentPlugin } from '@udecode/plate-indent/react';
import { ParagraphPlugin } from '@udecode/plate/react';
import { FireLiComponent, FireMarker } from '../ui/indent-fire-marker';
import { TodoLi, TodoMarker } from '../ui/indent-todo-marker';
import { InlineEquationPlugin, EquationPlugin } from '@udecode/plate-math/react';

export const staticPlugins = [
  HeadingPlugin.configure({ options: { levels: 3 } }),
  BlockquotePlugin,
  CodeBlockPlugin,
  BasicMarksPlugin,
  HorizontalRulePlugin,
  LinkPlugin,
  DatePlugin,
  MentionPlugin,
  TablePlugin,
  TocPlugin,
  ImagePlugin,
  VideoPlugin,
  AudioPlugin,
  MediaEmbedPlugin,
  FilePlugin,
  InlineEquationPlugin, 
  EquationPlugin,
  CalloutPlugin,
  ColumnPlugin,

  // Marks
  FontColorPlugin,
  FontBackgroundColorPlugin,
  FontSizePlugin,
  HighlightPlugin,
  SkipMarkPlugin,

  // Block Style
  AlignPlugin,
  IndentPlugin.extend({
    inject: {
      targetPlugins: [
        ParagraphPlugin.key,
        ...HEADING_LEVELS,
        BlockquotePlugin.key,
        CodeBlockPlugin.key,
        TogglePlugin.key,
      ],
    },
  }),
  IndentListPlugin.extend({
    inject: {
      targetPlugins: [
        ParagraphPlugin.key,
        ...HEADING_LEVELS,
        BlockquotePlugin.key,
        CodeBlockPlugin.key,
        TogglePlugin.key,
      ],
    },
    options: {
      listStyleTypes: {
        fire: {
          liComponent: FireLiComponent,
          markerComponent: FireMarker,
          type: 'fire',
        },
        todo: {
          liComponent: TodoLi,
          markerComponent: TodoMarker,
          type: 'todo',
        },
      },
    },
  }),
  LineHeightPlugin,
];