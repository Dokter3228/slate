import {useCallback, useState} from "react";
import {Editable, Slate, withReact} from "slate-react";
import {createEditor, Transforms, Text, Editor} from "slate";
const initialValue = [
      {
        type: "paragraph",
        children: [{ text: 'A line of text in a paragraph.' }],
      }
]

const CustomEditor = {
  toggleBoldMarkSpecial(editor) {
    Transforms.setNodes(
      editor, {
          bold: true,
        },
      { match: n => Text.isText(n), split: true }
    )
    Transforms.deselect(editor)
  },
}

const App = () => {
  const [editor] = useState(() => withReact(createEditor()))
  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />
  }, [])

  return <Slate onChange={() => {
    const [match] = Editor.nodes(editor, {at: [0],
              match: n => /\{[^{}]*\}/g.test(n.text) && !n.bold,
              mode: "all"
          })
            if(match){
              const pos = match[0].text.split("").findIndex((e) => e === "{")
              const pos2 = match[0].text.split("").findIndex((e) => e === "}")
              Transforms.select(editor, {
                anchor: Editor.start(editor, {path: match[1], offset: pos}),
                focus: Editor.end(editor, {
                  path: match[1],
                  offset: pos2 + 1
                }),
              })
            CustomEditor.toggleBoldMarkSpecial(editor, pos2)
            }
  }} editor={editor} value={initialValue}>
    <Editable
        renderLeaf={renderLeaf}
    />
  </Slate>
}

const Leaf = props => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
    >
      {props.children}
    </span>
  )
}

export default App;
