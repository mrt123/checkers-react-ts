import styled from "styled-components";

interface FieldBoxProps {
  img: string;
  highlight: boolean;
  cursorIsPointer: boolean;
}

const FieldBox = styled.div<FieldBoxProps>`
    position: relative;
    cursor: ${(p) => (p.cursorIsPointer ? "pointer" : "default")};
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
    color: red;s
    font-size: 9px;
    background-image: url("${(p) => p.img}");
    ${(p) =>
      p.highlight
        ? "box-shadow: inset -8px 11px 8px 3px rgba(0, 0, 0, 0.5)"
        : undefined};
  `;

export default FieldBox;
