import React, { FC, useState, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { rem, lighten } from 'polished';
import { colors } from '@atlaskit/theme';
import MUDeleteIcon from '@material-ui/icons/DeleteOutlineOutlined';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { Task } from '../types';
import Tick from './icons/Tick';
import { PlannerDispatch } from './PlannerProvider';
import { disableGlobalHotkeys } from './PlannerProvider/state';
import { Keys } from '../types';
import { noctisAzureus as na } from '../theme';
import { MAX_LINES } from '../constants';

type Props = {
  task: Task;
  isDragging: boolean;
  listId: string;
};

const DeleteIcon = styled(({ stagedForDeletion, ...otherProps }) => (
  <MUDeleteIcon {...otherProps} />
))`
  && {
    width: ${rem(12)};
    height: ${rem(12)};
    transition: 250ms color ease;
    color: ${(props) =>
      props.stagedForDeletion
        ? na.taskCard.colorDeleteIconStaged
        : na.taskCard.colorDeleteIcon};
    cursor: pointer;
    &:hover {
      color: ${(props) =>
        props.stagedForDeletion
          ? lighten(0.2, na.taskCard.colorDeleteIconStaged)
          : lighten(0.2, na.taskCard.colorDeleteIcon)};
    }
  }
`;

const ContextMenu = styled.div`
  background-color: transparent;
  margin-bottom: ${rem(-2)};
  opacity: 0;
  transition: 250ms opacity ease 100ms;
`;

const ContextOption = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: ${rem(3)};
  margin-bottom: ${rem(2)};
`;

const Card = styled.div<{
  isDragging: boolean;
}>`
  display: flex;
  flex: 1;
  position: relative;
  background-color: ${na.taskCard.bg};
  padding: ${rem(12)} ${rem(8)} ${rem(12)};
  transition: margin 0.15s ease;
  margin-top: ${rem(2)};
  box-shadow: ${({ isDragging }) =>
    isDragging ? `${rem(2)} ${rem(2)} ${rem(1)} ${colors.N70}` : 'none'};

  &:hover,
  &:active {
    color: ${colors.N900};
    text-decoration: none;

    ${ContextMenu} {
      opacity: 1;
    }
  }

  &:focus {
    outline: none;
    border-color: ${colors.N60};
    box-shadow: none;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  user-select: none;
  cursor: grab;
  &:hover {
    ${Card} {
      margin-top: ${rem(0)};
      margin-bottom: ${rem(2)};
    }
  }
`;

const OuterContainer = styled.div`
  margin-bottom: ${rem(0)};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Title = styled.div<{
  isComplete: boolean;
}>`
  display: -webkit-box;
  -webkit-line-clamp: ${MAX_LINES};
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  word-break: break-word;
  font-size: ${rem(12)};
  font-weight: 400;
  line-height: 1.42;
  color: ${na.taskCard.color};
  text-decoration: ${({ isComplete }) => (isComplete ? 'line-through' : 'none')};
  text-align: left;
  white-space: pre-line;
`;

const TitleContainer = styled.div<{
  isEditing: boolean;
}>`
  display: flex;
  flex-direction: column;
  flex: 1;
  transition: 300ms background-color ease;
  padding: ${rem(3)};
  border: none;

  ${(props) =>
    props.isEditing &&
    `
      background-color: ${na.taskCard.bgEditing}
    `}
`;

const IDTag = styled.small`
  color: ${na.taskCard.id};
  align-self: flex-end;
  font-weight: 600;
  font-size: ${rem(10)};
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: flex-end;
  align-items: flex-end;
`;

const StatusButton = styled.button<{
  isComplete: boolean;
}>`
  height: ${rem(40)};
  width: ${rem(40)};
  border-radius: 50%;
  border-color: ${na.taskCard.check.borderColor};
  color: ${na.taskCard.check.color};
  fill: ${na.taskCard.check.color};
  transition: 200ms border-color ease;
  transition: 200ms fill ease;
  transition: 200ms background-color ease;
  transition: 200ms color ease;
  margin-right: ${rem(10)};
  background-color: transparent;
  border-style: solid;

  &:focus {
    outline: 0;
  }

  &:active {
    border-color: ${na.taskCard.check.borderColorActive};
    fill: ${na.taskCard.check.colorActive};
    background-color: ${na.taskCard.check.backgroundColorActive};
  }

  &:hover {
    background-color: ${na.taskCard.check.backgroundColorHover};
    border-color: ${na.taskCard.check.borderColorHover};
    color: ${na.taskCard.check.colorHover};
    fill: ${na.taskCard.check.colorHover};
    cursor: pointer;
    &:active {
      border-color: ${na.taskCard.check.borderColorActive};
      fill: ${na.taskCard.check.colorActive};
      background-color: ${na.taskCard.check.backgroundColorActive};
    }
  }

  ${(props) =>
    props.isComplete &&
    `
    background: ${na.taskCard.check.backgroundColorComplete};
    border-color: ${na.taskCard.check.backgroundColorComplete};
    fill: ${na.taskCard.check.colorComplete};

    &:hover {
      background: ${na.taskCard.check.borderColorCompleteHover};
      border-color: ${na.taskCard.check.backgroundColorCompleteHover};
      fill: ${na.taskCard.check.colorComplete};
      cursor: pointer;

      &:active {
        border-color: ${na.taskCard.check.borderColorCompleteActive};
        fill: ${na.taskCard.check.colorCompleteActive};
        background-color: ${na.taskCard.check.backgroundColorCompleteActive};
      }
    }
    `}
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0.25;
  justify-content: center;
  align-items: center;
`;

const EditTextArea = styled(TextareaAutosize)`
  font-family: Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: ${rem(12)};
  font-weight: 400;
  line-height: 1.42;
  color: ${na.taskCard.colorEditing};
  padding: 0;
  resize: none;
  overflow: hidden;
  background-color: ${na.taskCard.bgEditing};
  border: none;
  transition: border 200ms ease, background 200ms ease;
  z-index: 5;
  text-align: left;
  text-decoration: none;

  &:focus {
    outline: none;
  }
`;

const TaskCard: FC<Props> = (props) => {
  const { markTaskComplete, deleteItem, updateState, updateTask } = React.useContext(
    PlannerDispatch,
  );
  const [stagedForDeletion, setStageDelete] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [taskText, setTaskText] = useState<string>(props.task.title);
  const cardRef = useRef<HTMLDivElement>(null);
  const editRef = useRef<HTMLTextAreaElement>(null);
  const keysDown = useRef<{ meta: boolean; enter: boolean }>({
    meta: false,
    enter: false,
  });
  const { task, listId } = props;

  /**
   * This hook is used to set the focus on the text area when it enters
   * its isAdding state.
   */
  useEffect(() => {
    if (isEditing && editRef?.current) {
      editRef.current.focus();
      /* This is used to set the cursor to the end of the textarea instead of the front */
      editRef.current.selectionStart = editRef.current.value.length;
      editRef.current.selectionEnd = editRef.current.value.length;
    }
  }, [isEditing]);

  /**
   * This hook is used to detect when a click event has occured outside of the
   * text area component. The handlers are only added if the text area is entering
   * its isEditing state.
   */
  useEffect(() => {
    if (isEditing) {
      document.addEventListener('click', handleClickOutside, false);
      document.addEventListener('keydown', handleKeyPress, false);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside, false);
      document.removeEventListener('keydown', handleKeyPress, false);
    };
  }, [isEditing, taskText]);

  /**
   * Always keep this listener running to update whether meta key is up or down
   */
  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp, false);
    return () => {
      document.removeEventListener('keyup', handleKeyUp, false);
    };
  }, []);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (isEditing && e.key === Keys.Escape) {
        setIsEditing(false);
        updateState(disableGlobalHotkeys(false));
      } else if (isEditing && e.key === Keys.Meta && !keysDown.current.enter) {
        keysDown.current.meta = true;
      } else if (
        isEditing &&
        e.key === Keys.Enter &&
        keysDown.current.meta &&
        taskText.trim().length > 0
      ) {
        // If CMD+Enter, then update the existing task
        updateTask({ ...task, title: taskText.trim(), description: taskText.trim() });
        setTaskText(taskText.trim());
        setIsEditing(false);
        updateState(disableGlobalHotkeys(false));
      }
    },
    [isEditing, taskText],
  );

  /**
   * This hook houses logic for the 2-stage deletion process
   */
  const handleDelete = useCallback(() => {
    if (stagedForDeletion) {
      deleteItem(task.id);
      updateState(disableGlobalHotkeys(false));
    } else if (!stagedForDeletion) {
      setStageDelete(true);
    }
  }, [stagedForDeletion]);

  /**
   * This hook is used to detect when a click event has occured outside of the
   * card. The handlers are only added if the text area is entering
   * its stagedForDeletion state.
   */
  useEffect(() => {
    if (stagedForDeletion) {
      document.addEventListener('click', handleClickOutside, false);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside, false);
    };
  }, [stagedForDeletion]);

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setTaskText(taskText.trim());
        updateTask({ ...task, title: taskText.trim(), description: taskText.trim() });
        setStageDelete(false);
        setIsEditing(false);
        updateState(disableGlobalHotkeys(false));
      }
    },
    [taskText],
  );

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === Keys.Meta) {
      keysDown.current.meta = false;
    }
  }, []);

  return (
    <OuterContainer>
      <Container>
        <Card isDragging={false} ref={cardRef}>
          <ButtonWrapper>
            <StatusButton
              isComplete={task.is_complete}
              onClick={() => markTaskComplete(task.id, listId)}
            >
              <Tick />
            </StatusButton>
          </ButtonWrapper>
          <Content
            onDoubleClick={() => {
              updateState(disableGlobalHotkeys(true));
              setIsEditing(true);
            }}
          >
            <TitleContainer isEditing={isEditing}>
              {!isEditing && (
                <Title title={taskText} isComplete={task.is_complete}>
                  {taskText}
                </Title>
              )}
              {isEditing && (
                <>
                  <EditTextArea
                    ref={editRef}
                    value={taskText}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setTaskText(e.target.value)
                    }
                  />
                </>
              )}
            </TitleContainer>
            <Footer>
              <ContextMenu>
                <ContextOption>
                  <DeleteIcon
                    stagedForDeletion={stagedForDeletion}
                    onClick={handleDelete}
                  />
                </ContextOption>
              </ContextMenu>
              <IDTag>{`id: ${task.id.slice(0, 6)}`}</IDTag>
            </Footer>
          </Content>
        </Card>
      </Container>
    </OuterContainer>
  );
};

export default TaskCard;
