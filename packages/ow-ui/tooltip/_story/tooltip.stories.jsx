import React, {useRef} from "react";
import '../../storyBase/storyBase.css';
import Tooltip from "../tooltip";

function Template(args) {

  const tempRef = useRef(null)

  const Container = (props) =>{
    return(
      <div style={{width: "100%", height: "100%", position: 'relative',display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems:'center', flexShrink: 0}} ref={tempRef}>
        {props.children}
      </div>
    )
  }

  return (
    <div className='flex-col flex-col-center' style={{height: '600px'}}>
      <Container>
        <Tooltip position={'top'}  content={"tooltip"} trigger="hover" getPopupContainer={() => tempRef.current}>
          <div>top</div>
        </Tooltip>
        <Tooltip position={'right'}  content={"tooltip"} trigger="hover" getPopupContainer={() => tempRef.current}>
          <div>right</div>
        </Tooltip>
        <Tooltip position={'bottom'}  content={"tooltip"} trigger="hover" getPopupContainer={() => tempRef.current}>
          <div>bottom</div>
        </Tooltip>
        <Tooltip position={'left'}  content={"tooltip"} trigger="hover" getPopupContainer={() => tempRef.current}>
          <div>left</div>
        </Tooltip>
        <Tooltip position={'left'}  content={"tooltip"} trigger="click" getPopupContainer={() => tempRef.current}>
          <div>click</div>
        </Tooltip>
      </Container>
    </div>
  );
}

export const BaseToolTip = Template.bind({});

BaseToolTip.args = {
  text: 'tooltip',
  label: 'tooltip',
};

export default {
  title: 'Tooltip',
  component: Tooltip,
};
