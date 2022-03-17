import React from "react";
import Button from "../button";
import {render, screen} from '@testing-library/react'
import { fireEvent } from "@storybook/testing-library";

describe('Button', () =>{
  test('button with base style', () =>{
    render(<Button>test</Button>)
    expect(screen.getByText('test')).toHaveClass('ow-button')
  })

  test('button with custom className & style', () =>{
    render(<Button className='testClass' style={{background:'black'}}>test</Button>)
    expect(screen.getByText('test')).toHaveClass('testClass')
    expect(screen.getByText('test')).toHaveStyle('background: black')
  })

  test('button disabled', () =>{
    render(<Button disabled>test</Button> )
    expect(screen.getByText('test')).toBeDisabled()
    expect(screen.getByText('test')).toHaveClass('ow-button-disabled')
  })

  test('button size', () =>{
    render(<Button size='small'>small</Button>)
    render(<Button>default</Button>)
    render(<Button size='large'>large</Button>)

    expect(screen.getByText('small')).toHaveClass('ow-button-small')
    expect(screen.getByText('default')).toHaveClass('ow-button-default')
    expect(screen.getByText('large')).toHaveClass('ow-button-large')
  })

  test('button type', () =>{
    render(<Button type='primary'>primary</Button> )
    render(<Button type='warning'>warning</Button> )

    expect(screen.getByText('primary')).toHaveClass('ow-button-primary')
    expect(screen.getByText('warning')).toHaveClass('ow-button-warning')
  })

  test('click could be called', () =>{
    const ClickDemo = ({fn}) =>{
      return <Button onClick={fn}>test</Button>
    }
    const fn = jest.fn().mockName('click')
    render(<ClickDemo fn={fn}/>)
    const demo = screen.getByText('test')
    expect(fn).not.toBeCalled()
    for(let i = 0; i < 3; ++i){
      fireEvent.click(demo)
      expect(fn).toBeCalledTimes(i + 1)
    }
  })

  test('mouseEnter & mouseLeave', () =>{

    const enterCallback = jest.fn().mockName('mouseEnter')
    const leaveCallback = jest.fn().mockName('mouseLeave')
    render(<Button onMouseEnter={enterCallback} onMouseLeave={leaveCallback}>test</Button>)
    const demo = screen.getByText('test')

    expect(enterCallback).not.toHaveBeenCalled()
    expect(leaveCallback).not.toHaveBeenCalled()
    fireEvent.mouseOver(demo)
    expect(enterCallback).toHaveBeenCalled()
    fireEvent.mouseOut(demo)
    expect(leaveCallback).toHaveBeenCalled()
  })
})