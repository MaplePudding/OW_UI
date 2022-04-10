import React from "react";
import Tooltip from "../tooltip";
import {render, screen, fireEvent} from '@testing-library/react'


describe('Tooltip', () =>{
  test('base render', () =>{
    render(
      <Tooltip>
        <div>trigger</div>
      </Tooltip>
    )
    expect(screen.getByText('trigger')).toHaveClass('ow-tooltip')
  })

  test('portal inserted when hover', async () =>{
    render(
      <Tooltip content={"tooltip"}>
        <div>trigger</div>
      </Tooltip>
    )

    expect(screen.queryByText('tooltip')).toBeNull()

    // hover
    fireEvent.mouseOver(screen.getByText('trigger'))

    await new Promise((resolve, reject) =>{
      setTimeout(() =>{
        expect(screen.queryByText('tooltip')).toBeTruthy()
        resolve(null)
      }, 10)
    })
  })

  test('portal inserted when click', async () =>{
    render(
      <Tooltip content={'tooltip'} trigger={'click'}>
        <div>click</div>
      </Tooltip>
    )

    expect(screen.queryByText('tooltip')).toBeNull()
    //click
    fireEvent.click(screen.getByText('click'))
    await new Promise((resolve, reject) =>{
      setTimeout(() =>{
        expect(screen.queryByText('tooltip')).toBeTruthy()
        resolve(null)
      }, 10)
    })
  })
})