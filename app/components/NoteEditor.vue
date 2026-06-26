<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Link from '@tiptap/extension-link'
import Highlight from '@tiptap/extension-highlight'
import TextStyle from '@tiptap/extension-text-style'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  editable?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editor = useEditor({
  content: props.modelValue,
  editable: props.editable !== false,
  extensions: [
    StarterKit,
    Underline,
    Highlight,
    TextStyle,
    TaskList,
    TaskItem.configure({ nested: true }),
    Link.configure({ openOnClick: false }),
    Placeholder.configure({ placeholder: props.placeholder ?? 'Start writing…' })
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  }
})

watch(() => props.modelValue, (val) => {
  if (editor.value && editor.value.getHTML() !== val) {
    editor.value.commands.setContent(val, false)
  }
})

watch(() => props.editable, (val) => {
  editor.value?.setEditable(val !== false)
})

onBeforeUnmount(() => editor.value?.destroy())

function toggleBold() { editor.value?.chain().focus().toggleBold().run() }
function toggleItalic() { editor.value?.chain().focus().toggleItalic().run() }
function toggleUnderline() { editor.value?.chain().focus().toggleUnderline().run() }
function toggleStrike() { editor.value?.chain().focus().toggleStrike().run() }
function toggleHighlight() { editor.value?.chain().focus().toggleHighlight().run() }
function setH1() { editor.value?.chain().focus().toggleHeading({ level: 1 }).run() }
function setH2() { editor.value?.chain().focus().toggleHeading({ level: 2 }).run() }
function toggleBulletList() { editor.value?.chain().focus().toggleBulletList().run() }
function toggleOrderedList() { editor.value?.chain().focus().toggleOrderedList().run() }
function toggleTaskList() { editor.value?.chain().focus().toggleTaskList().run() }
function toggleBlockquote() { editor.value?.chain().focus().toggleBlockquote().run() }
function toggleCode() { editor.value?.chain().focus().toggleCode().run() }
function toggleCodeBlock() { editor.value?.chain().focus().toggleCodeBlock().run() }

function setLink() {
  const url = window.prompt('Enter URL')
  if (url) {
    editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  } else {
    editor.value?.chain().focus().unsetLink().run()
  }
}

const isActive = (name: string, attrs?: Record<string, any>) =>
  editor.value?.isActive(name, attrs) ?? false
</script>

<template>
  <div class="tiptap-editor flex flex-col h-full">
    <!-- Toolbar (only when editable) -->
    <div
      v-if="editable !== false"
      class="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-zinc-200 dark:border-zinc-700 shrink-0"
    >
      <UButton icon="i-lucide-bold" :color="isActive('bold') ? 'violet' : 'neutral'" variant="ghost" size="xs" @click="toggleBold" />
      <UButton icon="i-lucide-italic" :color="isActive('italic') ? 'violet' : 'neutral'" variant="ghost" size="xs" @click="toggleItalic" />
      <UButton icon="i-lucide-underline" :color="isActive('underline') ? 'violet' : 'neutral'" variant="ghost" size="xs" @click="toggleUnderline" />
      <UButton icon="i-lucide-strikethrough" :color="isActive('strike') ? 'violet' : 'neutral'" variant="ghost" size="xs" @click="toggleStrike" />
      <UButton icon="i-lucide-highlighter" :color="isActive('highlight') ? 'violet' : 'neutral'" variant="ghost" size="xs" @click="toggleHighlight" />
      <div class="w-px h-4 bg-zinc-200 dark:bg-zinc-700 mx-0.5" />
      <UButton label="H1" :color="isActive('heading', { level: 1 }) ? 'violet' : 'neutral'" variant="ghost" size="xs" class="font-bold" @click="setH1" />
      <UButton label="H2" :color="isActive('heading', { level: 2 }) ? 'violet' : 'neutral'" variant="ghost" size="xs" class="font-semibold" @click="setH2" />
      <div class="w-px h-4 bg-zinc-200 dark:bg-zinc-700 mx-0.5" />
      <UButton icon="i-lucide-list" :color="isActive('bulletList') ? 'violet' : 'neutral'" variant="ghost" size="xs" @click="toggleBulletList" />
      <UButton icon="i-lucide-list-ordered" :color="isActive('orderedList') ? 'violet' : 'neutral'" variant="ghost" size="xs" @click="toggleOrderedList" />
      <UButton icon="i-lucide-list-checks" :color="isActive('taskList') ? 'violet' : 'neutral'" variant="ghost" size="xs" @click="toggleTaskList" />
      <div class="w-px h-4 bg-zinc-200 dark:bg-zinc-700 mx-0.5" />
      <UButton icon="i-lucide-quote" :color="isActive('blockquote') ? 'violet' : 'neutral'" variant="ghost" size="xs" @click="toggleBlockquote" />
      <UButton icon="i-lucide-code" :color="isActive('code') ? 'violet' : 'neutral'" variant="ghost" size="xs" @click="toggleCode" />
      <UButton icon="i-lucide-square-code" :color="isActive('codeBlock') ? 'violet' : 'neutral'" variant="ghost" size="xs" @click="toggleCodeBlock" />
      <UButton icon="i-lucide-link" :color="isActive('link') ? 'violet' : 'neutral'" variant="ghost" size="xs" @click="setLink" />
    </div>

    <!-- Editor area -->
    <div class="flex-1 overflow-y-auto scrollbar-thin p-3">
      <EditorContent :editor="editor" class="h-full" />
    </div>
  </div>
</template>
