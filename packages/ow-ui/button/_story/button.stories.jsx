import * as React from 'react';
import '../../storyBase/storyBase.css';
import Button from '../button';

function PrimaryButtons(props) {
  return (
    <div className="flex-row flex-row-around">
      <Button type="primary" size="small">{props.text}</Button>
      <Button type="primary" size="default">{props.text}</Button>
      <Button type="primary" size="large">{props.text}</Button>
    </div>
  );
}

function WarningButtons(props) {
  return (
    <div className="flex-row flex-row-around">
      <Button type="warning" size="small">{props.text}</Button>
      <Button type="warning" size="default">{props.text}</Button>
      <Button type="warning" size="large">{props.text}</Button>
    </div>
  );
}

function DisabledButton(props){
  return (
    <div className='p-10 flex-row flex-center'>
      <Button type='primary' size='default' disabled>{props.text}</Button>
    </div>
  )
}

function BlockButton(props) {
  return (
    <div className='p-10 flex-row flex-center'>
      <Button block type='primary' size='default' >{props.text}</Button>
    </div>
  )
}
function Template(args) {
  return (
    <div className="flex-col flex-col-around">
      <PrimaryButtons text={args.text} />
      <WarningButtons text={args.text} />
      <DisabledButton text={args.text}/>
      <BlockButton text={args.text} />
    </div>
  );
}

export const BaseButton = Template.bind({});

BaseButton.args = {
  text: 'button',
  label: 'button',
};

export default {
  title: 'Button',
  component: Button,
};
