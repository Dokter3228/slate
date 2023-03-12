import {useCallback, useState} from "react";
import {Editable, Slate, withReact} from "slate-react";
import {createEditor, Editor, Transforms, Text} from "slate";

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

const initialValue = [
      {
        type: "paragraph",
        children: [{ text: 'A line of text in a paragraph.' }],
      }
]

const App = () => {
  const [editor] = useState(() => withReact(createEditor()))

  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />
  }, [])

  return <Slate onChange={(e) => {
  }} editor={editor} value={initialValue}>
    <Editable
        renderLeaf={renderLeaf}
        onKeyDown={event => {
            const [match] = Editor.nodes(editor, {at: [0],
              match: n => /\{([^}]+)\}/g.test(n.text) && !n.bold,
              mode: "all"
              })
            if(match){
              console.log(match)
              const pos = match[0].text.split("").findIndex((e) => e === "{")
              const pos2 = match[0].text.split("").findIndex((e) => e === "}")
              Transforms.select(editor, {
                anchor: Editor.start(editor, {path: match[1], offset: pos}),
                focus: Editor.end(editor, {
                  path: [0,0],
                  offset: pos2 + 1
                }),
              })
            CustomEditor.toggleBoldMarkSpecial(editor, pos2)
            }
        }}
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
