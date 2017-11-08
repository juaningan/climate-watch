import { EditorState } from 'draft-js';

export default {
  pickerIsOpen: false,
  title: '',
  titlePlaceholder: 'Title of the insight',
  content: EditorState.createEmpty(),
  titleIsFocused: true,
  editorIsFocused: false
};
