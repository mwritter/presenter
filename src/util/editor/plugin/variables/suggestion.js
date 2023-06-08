import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'

import VariableList from './components/VariableList'

export default (variables) => ({
    char: '\\',
    allowedPrefixes: null,
    items: ({ query }) => {
        return variables
            .filter(item => item.toLowerCase().startsWith(query.toLowerCase()))
            .slice(0, 5)
    },

    command: ({ editor, range, props }) => {
        editor
            .chain()
            .focus()
            .insertContentAt(range, [
                {
                    type: 'mention',
                    attrs: props
                },
            ])
            .run()

    },

    render: () => {
        let component
        let popup

        return {
            onStart: props => {
                component = new ReactRenderer(VariableList, {
                    props,
                    editor: props.editor,
                })

                if (!props.clientRect) {
                    return
                }

                popup = tippy('body', {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                })
            },

            onUpdate(props) {
                component.updateProps(props)

                if (!props.clientRect) {
                    return
                }

                popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                })
            },

            onKeyDown(props) {
                if (props.event.key === 'Escape') {
                    popup[0].hide()

                    return true
                }
                if (props.event.key === 'Space') {
                }
                return component.ref?.onKeyDown(props)
            },

            onExit() {
                popup[0].destroy()
                component.destroy()
            },
        }
    },
})