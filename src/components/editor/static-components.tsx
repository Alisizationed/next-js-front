import { withProps } from "@udecode/cn";
import { BoldPlugin, CodePlugin, ItalicPlugin, StrikethroughPlugin, SubscriptPlugin, SuperscriptPlugin, UnderlinePlugin } from "@udecode/plate-basic-marks/react";
import { BlockquotePlugin } from "@udecode/plate-block-quote/react";
import { CalloutPlugin } from "@udecode/plate-callout/react";
import { CodeBlockPlugin, CodeLinePlugin, CodeSyntaxPlugin } from "@udecode/plate-code-block/react";
import { CommentsPlugin } from "@udecode/plate-comments/react";
import { DatePlugin } from "@udecode/plate-date/react";
import { HEADING_KEYS } from "@udecode/plate-heading";
import { TocPlugin } from "@udecode/plate-heading/react";
import { HighlightPlugin } from "@udecode/plate-highlight/react";
import { HorizontalRulePlugin } from "@udecode/plate-horizontal-rule/react";
import { KbdPlugin } from "@udecode/plate-kbd/react";
import { ColumnItemPlugin, ColumnPlugin } from "@udecode/plate-layout/react";
import { LinkPlugin } from "@udecode/plate-link/react";
import { EquationPlugin, InlineEquationPlugin } from "@udecode/plate-math/react";
import { AudioPlugin, FilePlugin, ImagePlugin, VideoPlugin } from "@udecode/plate-media/react";
import { MentionPlugin } from "@udecode/plate-mention/react";
import { SuggestionPlugin } from "@udecode/plate-suggestion/react";
import { TableCellHeaderPlugin, TableCellPlugin, TablePlugin, TableRowPlugin } from "@udecode/plate-table/react";
import { TogglePlugin } from "@udecode/plate-toggle/react";
import { PlateLeaf, ParagraphPlugin } from "@udecode/plate/react";
import { BlockquoteElementStatic } from "../ui/blockquote-element-static";
import { CalloutElementStatic } from "../ui/callout-element-static";
import { CodeBlockElementStatic } from "../ui/code-block-element-static";
import { CodeLeafStatic } from "../ui/code-leaf-static";
import { CodeLineElementStatic } from "../ui/code-line-element-static";
import { CodeSyntaxLeafStatic } from "../ui/code-syntax-leaf-static";
import { ColumnElementStatic } from "../ui/column-element-static";
import { ColumnGroupElementStatic } from "../ui/column-group-element-static";
import { CommentLeafStatic } from "../ui/comment-leaf-static";
import { DateElementStatic } from "../ui/date-element-static";
import { EquationElementStatic } from "../ui/equation-element-static";
import { HeadingElementStatic } from "../ui/heading-element-static";
import { HighlightLeafStatic } from "../ui/highlight-leaf-static";
import { HrElementStatic } from "../ui/hr-element-static";
import { ImageElementStatic } from "../ui/image-element-static";
import { InlineEquationElementStatic } from "../ui/inline-equation-element-static";
import { KbdLeafStatic } from "../ui/kbd-leaf-static";
import { LinkElementStatic } from "../ui/link-element-static";
import { MediaAudioElementStatic } from "../ui/media-audio-element-static";
import { MediaFileElementStatic } from "../ui/media-file-element-static";
import { MediaVideoElementStatic } from "../ui/media-video-element-static";
import { MentionElementStatic } from "../ui/mention-element-static";
import { ParagraphElementStatic } from "../ui/paragraph-element-static";
import { SuggestionLeafStatic } from "../ui/suggestion-leaf-static";
import { TableCellElementStatic } from "../ui/table-cell-element-static";
import { TableElementStatic } from "../ui/table-element-static";
import { TableRowElementStatic } from "../ui/table-row-element-static";
import { TocElementStatic } from "../ui/toc-element-static";
import { ToggleElementStatic } from "../ui/toggle-element-static";
import { TableCellHeaderElement } from "../ui/table-cell-element";

export const staticComponents = {
  [AudioPlugin.key]: MediaAudioElementStatic,
  [BlockquotePlugin.key]: BlockquoteElementStatic,
  [BoldPlugin.key]: withProps(PlateLeaf, { as: 'strong' }),
  [CalloutPlugin.key]: CalloutElementStatic,
  [CodeBlockPlugin.key]: CodeBlockElementStatic,
  [CodeLinePlugin.key]: CodeLineElementStatic,
  [CodePlugin.key]: CodeLeafStatic,
  [CodeSyntaxPlugin.key]: CodeSyntaxLeafStatic,
  [ColumnItemPlugin.key]: ColumnElementStatic,
  [ColumnPlugin.key]: ColumnGroupElementStatic,
  [CommentsPlugin.key]: CommentLeafStatic,
  [DatePlugin.key]: DateElementStatic,
  [EquationPlugin.key]: EquationElementStatic,
  [FilePlugin.key]: MediaFileElementStatic,
  [HEADING_KEYS.h1]: withProps(HeadingElementStatic, { variant: 'h1' }),
  [HEADING_KEYS.h2]: withProps(HeadingElementStatic, { variant: 'h2' }),
  [HEADING_KEYS.h3]: withProps(HeadingElementStatic, { variant: 'h3' }),
  [HEADING_KEYS.h4]: withProps(HeadingElementStatic, { variant: 'h4' }),
  [HEADING_KEYS.h5]: withProps(HeadingElementStatic, { variant: 'h5' }),
  [HEADING_KEYS.h6]: withProps(HeadingElementStatic, { variant: 'h6' }),
  [HighlightPlugin.key]: HighlightLeafStatic,
  [HorizontalRulePlugin.key]: HrElementStatic,
  [ImagePlugin.key]: ImageElementStatic,
  [InlineEquationPlugin.key]: InlineEquationElementStatic,
  [ItalicPlugin.key]: withProps(PlateLeaf, { as: 'em' }),
  [KbdPlugin.key]: KbdLeafStatic,
  [LinkPlugin.key]: LinkElementStatic,
//   [MediaEmbedPlugin.key]: MediaEmbedElementStatic,
  [MentionPlugin.key]: MentionElementStatic,
  [ParagraphPlugin.key]: ParagraphElementStatic,
//   [PlaceholderPlugin.key]: MediaPlaceholderElementStatic,
  [StrikethroughPlugin.key]: withProps(PlateLeaf, { as: 's' }),
  [SubscriptPlugin.key]: withProps(PlateLeaf, { as: 'sub' }),
  [SuggestionPlugin.key]: SuggestionLeafStatic,
  [SuperscriptPlugin.key]: withProps(PlateLeaf, { as: 'sup' }),
  [TableCellHeaderPlugin.key]: TableCellHeaderElement,
  [TableCellPlugin.key]: TableCellElementStatic,
  [TablePlugin.key]: TableElementStatic,
  [TableRowPlugin.key]: TableRowElementStatic,
  [TocPlugin.key]: TocElementStatic,
  [TogglePlugin.key]: ToggleElementStatic,
  [UnderlinePlugin.key]: withProps(PlateLeaf, { as: 'u' }),
  [VideoPlugin.key]: MediaVideoElementStatic,
};