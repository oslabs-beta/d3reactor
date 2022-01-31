/* eslint-disable @typescript-eslint/restrict-plus-operands */
// import { clearConfigCache } from 'prettier';
// import React from 'react';
// import styled from 'styled-components';

// const triangleSize = 12;
// const shadowElevationHigh = `0 0 10px 0 rgba(80, 80, 80, 0.2)`;

// interface StyledTooltipProps {
//   cursorX: number;
//   cursorY: number;
//   contentTranslation: string;
//   triangleTranslation: string;
//   triangleBorderTranslation: string;
//   xKey: string;
//   xValString: string;
//   yKey: string;
//   yValString: string;
//   children?: JSX.Element[];
// }

// const StyledTooltip = styled.div`
//     left: ${(props) => props.cursorX};
//     top: ${(props) => props.cursorY};
//     transform: translate(-50%, -50%);
//     position: absolute;
//     pointerEvents: none;
//     fontFamily: Tahoma, Geneva, Verdana, sans-serif,
//     fontSize: 12px,
//     color: ${(props) => props.theme.tooltipBackgroundColor},
// `;

// const StyledContent = styled.div`
//   position: absolute;
//   margin: 4px 4px;
//   padding: 0.6em 1em;
//   borde-radius: 4px;
//   min-width: 140px;
//   max-width: 240px;
//   transform: ${(props) => props.theme.contentTranslation};
//   background: ${(props) => props.theme.tooltipBackgroundColor};
//   textalign: center;
//   lineheight: 1.4em;
//   fontsize: 1em;
// `;

// const StyledTriangleBorder = styled.div`
//     content: '',
//     position: absolute;
//     width: triangleSize;
//     height: triangleSize;
//     background: ${(props) => props.theme.tooltipBorder};
//     transform: ${(props) => props.theme.triangleBorderTranslation};,
//     transform-origin: center center;
//     boxShadow: shadowElevationHigh,
//     z-index: 8;
//     transition: all 0.1s ease-out;
//     pointer-events: none;
// `;

// const StyledTriangle = styled.div`
//     content: '';
//     position: absolute;
//     width: triangleSize;
//     height: triangleSize;
//     background: backgroundColor,
//     transform: ${(props) => props.theme.triangleTranslation};
//     transform-origin: center center;
//     z-index: 10;
//     transition: all 0.1s ease-out;
//     pointer-events: none;
// `;

// const TooltipContent = ({
//   cursorX = 0,
//   cursorY = 0,
//   contentTranslation = '',
//   triangleTranslation = '',
//   triangleBorderTranslation = '',
//   xKey = '',
//   xValString = '',
//   yKey = '',
//   yValString = '',
// }) => {
//   // const styles = SIZES[size];

//   return (
//     <StyledTooltip>
//       <StyledContent>
//         <div>
//           {xKey} <strong>{xValString}</strong>
//         </div>
//         <div>
//           {yKey} <strong>{yValString}</strong>
//         </div>
//       </StyledContent>
//       <StyledTriangle></StyledTriangle>
//       <StyledTriangleBorder></StyledTriangleBorder>
//     </StyledTooltip>
//   );
// };

// export default TooltipContent;
