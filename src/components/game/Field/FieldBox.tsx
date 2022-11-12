import styled from "styled-components";

interface FieldBoxProps {
  img: string;
  highlight: boolean;
  cursorIsPointer: boolean;
}

const darkBackgroundColorFallback = "rgba(167, 134, 90, 1)";
const whiteBackgroundColorFallback = "rgba(246, 195, 129, 1)";

const FieldBox = styled.div<FieldBoxProps>`
  position: relative;
  cursor: ${(p) => (p.cursorIsPointer ? "pointer" : "default")};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  font-size: 9px;

  // fallback while images are loading (TODO detect img loading)
  background-color: ${(p) =>
    p.color === "white"
      ? whiteBackgroundColorFallback
      : darkBackgroundColorFallback};

  background-image: ${(p) =>
    p.color === "white"
      ? "radial-gradient(circle, rgba(246, 195, 129, 1) 0%, rgba(246, 195, 132, 1) 100%  )"
      : "radial-gradient(circle, rgba(167, 134, 90, 1) 0%, rgba(106, 82, 56, 1) 100% )"};

  background-image: url("${(p) => p.img}");
  ${(p) =>
    p.highlight
      ? "box-shadow: inset -8px 11px 8px 3px rgba(0, 0, 0, 0.5)"
      : undefined};
`;

export default FieldBox;
