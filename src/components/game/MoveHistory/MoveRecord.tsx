import styled from "styled-components";
import { MoveRecord as MoveRecordType } from "../Board/state/boardStateTypes";
import PlayerColorIndicatorContainer from "../Pin/PlayerColorIndicator";

interface MoveRecordProps {
  record: MoveRecordType;
}

const MoveRecordBox = styled.div`
  display: flex;
  align-items: center;
  background: grey;
  font-size: 14px;
  margin-bottom: 6px;
  border-radius: 4px;
  padding: 4px 0px 4px 4px;
`;

const SkullIcon = styled.span`
  background: rgb(245 245 245 / 60%);
  display: inline-block;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  font-size: 30px;
  color: yellow;
  line-height: 16px;
  position: relative;
  top: 0px;

  &:after {
    position: relative;
    left: 3px;
    top: 1px;
    content: "☠";
    color: black;
  }
`;

const RecordText = styled.span`
  padding: 0 8px;
`;

const RecordNumber = styled.span`
  display: inline-block;
  width: 19px;
  text-align: center;
  padding-right: 3px;
  font-size: 10px;
`;

const MoveRecord = ({ record }: MoveRecordProps) => {
  const startPositionText = `x${record.start.x}/y${record.start.y}`;
  const endPositionText = `x${record.end.x}/y${record.end.y}`;
  const captureIcon = record.killedSomething ? <SkullIcon /> : null;
  const recordText = ` ${startPositionText} → ${endPositionText}`;

  return (
    <MoveRecordBox>
      <RecordNumber>{record.number}</RecordNumber>
      <PlayerColorIndicatorContainer color={record.playerColor} />
      <RecordText>{recordText}</RecordText>
      {captureIcon}
    </MoveRecordBox>
  );
};

export default MoveRecord;
