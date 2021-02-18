import React from 'react';

export interface EditableTextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  editable?: boolean;
}

const EditableTextInput = (props: EditableTextInputProps) => {
  const { editable, value, ...otherProps } = props;
  if (editable) {
    return <input value={value} {...otherProps} />;
  }
  return <div {...otherProps}>{value}</div>;
};

export default EditableTextInput;
