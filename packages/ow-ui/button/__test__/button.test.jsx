import React from "react";
import Button from "../button";
import {render} from '@testing-library/react'

describe('Button', () =>{
  test('button with custom className & style', () =>{
    const wrapper = render(<Button className='testClass' style={{background:'black'}}>test</Button>)
  })
})