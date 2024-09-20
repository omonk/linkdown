import { Detail, Action, ActionPanel, Clipboard, getSelectedText } from "@raycast/api";
import { usePromise } from "@raycast/utils";

type Data = {
  url?: URL;
  markdown: string;
  generatedMarkdownLink?: string;
  selectedText: string;
};

const generateMarkdown = async (): Promise<Data> => {
  const selectedText = await getSelectedText();

  const clipboardUrl = await Clipboard.readText();

  console.log({
    selectedText,
    clipboardUrl,
  });

  let url: URL;

  try {
    url = new URL(clipboardUrl ?? "");
  } catch (error) {
    console.error({ error });
    return { markdown: `# URL in clipboard is invalid: "${clipboardUrl}"`, selectedText };
  }

  const markdown = `# Link is ready\n## URL: ${url}\n## Text: ${selectedText}`;
  const generatedMarkdownLink = `[${selectedText}](${url.toString()})`;

  return {
    markdown,
    generatedMarkdownLink,
    selectedText,
    url,
  };
};

export default function Command() {
  const { isLoading, data } = usePromise(generateMarkdown, []);

  return (
    <Detail
      isLoading={isLoading}
      markdown={isLoading ? "Loading..." : (data?.markdown ?? "# Something went wrong")}
      actions={
        <ActionPanel title="#1 in raycast/extensions">
          <Action title="Paste Markdown" onAction={() => pasteMarkdown({ markdown: data?.generatedMarkdownLink })} />
          <Action
            title="Add Markdown to Clipboard"
            onAction={() => addMarkdownToClipboard({ markdown: data?.generatedMarkdownLink })}
          />
        </ActionPanel>
      }
    />
  );
}

async function pasteMarkdown({ markdown }: { markdown?: string }) {
  if (markdown) {
    await Clipboard.paste(markdown);
  }
}
async function addMarkdownToClipboard({ markdown }: { markdown?: string }) {
  if (markdown) {
    await Clipboard.copy(markdown);
  }
}

/**
 * This is the one
 * https://google.com
 * laksd
 * https://foo.bar.com
 * // ;lasdlasd
 */
