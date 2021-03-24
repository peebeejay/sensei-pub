import React, { FC, useContext, useState, useRef, useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { rem } from 'polished';
import PlusIcon from './icons/Plus';
import { Keys } from '../types';
import { PlannerDispatch } from './PlannerProvider';
import { disableGlobalHotkeys } from './PlannerProvider/state';
import { noctisAzureus as na } from '../theme';

type Props = {
  listId: string;
  loading: boolean;
  date: string;
  size: number;
};

const Plus = styled(PlusIcon)`
  transition: 200ms fill ease, 200ms stroke ease;
  fill: ${na.add.iconColor};
  stroke: ${na.add.iconColor};
  height: ${rem(10)};
`;

const AddButtonActiveStyling = css`
  background-color: ${na.add.bgAdding};
  ${Plus} {
    fill: ${na.add.iconColorHover};
    stroke: ${na.add.iconColorHover};
  }
`;

const AddButton = styled.div<{
  isAdding: boolean;
}>`
  height: ${rem(25)};
  margin-top: ${rem(10)};
  background-color: ${na.add.bg};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 200ms background-color ease;
  z-index: 10;

  ${(props) => props.isAdding && AddButtonActiveStyling}

  &:hover {
    background-color: ${na.add.bgHover};
    ${Plus} {
      fill: ${na.add.iconColorHover};
      stroke: ${na.add.iconColorHover};
    }
  }

  &:active {
    background-color: ${na.add.bgActive};
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const createTextEntry = keyframes`
  0% {
    transform: translateY(${rem(-30)});
  }
  40% {

  }
  100% {
    transform: translateY(${rem(0)});
  }
`;

const CreateTextArea = styled.textarea<{
  isAdding: boolean;
  isLoading: boolean;
  isStaged: boolean;
}>`
  font-family: 'Roboto Mono', monospace;
  font-size: ${rem(12)};
  transform: translateY(${rem(-30)});
  margin-top: ${rem(5)};
  resize: none;
  height: ${rem(0)};
  background-color: ${na.add.textAreaColor};
  border: ${rem(2)} solid transparent;
  transition: 200ms background-color ease, 200ms height ease;
  z-index: 5;
  color: ${na.add.textColor};
  line-height: 1.42;

  &:focus {
    outline: none;
  }

  ${(props) =>
    props.isStaged &&
    `
      background-color: ${na.add.textAreaIsStagedColor};
    `}

  ${(props) =>
    props.isAdding &&
    css`
      animation: 200ms ${createTextEntry} ease forwards;
      min-height: ${rem(100)};
      height: ${rem(100)};
    `}

  ${(props) =>
    props.isLoading &&
    `
      background-color: ${na.add.textAreaIsStagedColor};
    `}
`;

const AddTask: FC<Props> = (props) => {
  const { listId, loading, date, size } = props;
  const { createTask, updateState } = useContext(PlannerDispatch);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const addButtonRef = useRef<HTMLDivElement>(null);
  const [isSaveHintVisible, setIsSaveHintVisible] = useState<boolean>(false);
  const keysDown = useRef<{ meta: boolean; enter: boolean }>({
    meta: false,
    enter: false,
  });

  /**
   * This hook is used to detect changes in the loading state for a particular list
   * while and after a task is successfully persisted on the backend.
   *
   * Upon the successful creation of a task, the textarea is closed, and the description
   * is set back to an empty string ''.
   */
  useEffect(() => {
    /**
     * This condition identifies application state where a task is in the process of being
     * added to the backend. Think of this as POST-SAVE
     * loading - false - the API call has completed successfully
     * local isAdding - true - the textbox is still open
     */
    if (!loading && isAdding) {
      setDescription('');
      textAreaRef?.current?.focus();
    }
  }, [loading]);

  /**
   * This hook is used to set the focus on the text area when it enters
   * its isAdding state.
   */
  useEffect(() => {
    if (isAdding) {
      textAreaRef?.current?.focus();
    }
  }, [isAdding]);

  /**
   * This hook is used to detect when a click event has occured outside of the
   * text area component. The handlers are only added if the text area is entering
   * its isAdding state.
   */
  useEffect(() => {
    if (isAdding) {
      document.addEventListener('click', handleClickOutside, false);
      document.addEventListener('keydown', handleKeyPress, false);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside, false);
      document.removeEventListener('keydown', handleKeyPress, false);
    };
  }, [isAdding, description]);

  /**
   * Always keep this listener running to update whether meta key is up or down
   */
  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp, false);
    return () => {
      document.removeEventListener('keyup', handleKeyUp, false);
    };
  }, []);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (textAreaRef.current && !textAreaRef.current.contains(e.target as Node)) {
      setIsAdding(false);
      updateState(disableGlobalHotkeys(false));
    }
  }, []);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (isAdding && e.key === Keys.Escape) {
        setIsAdding(false);
        updateState(disableGlobalHotkeys(false));
      } else if (isAdding && e.key === Keys.Meta && !keysDown.current.enter) {
        keysDown.current.meta = true;
        setIsSaveHintVisible(true);
      } else if (
        isAdding &&
        e.key === Keys.Enter &&
        keysDown.current.meta &&
        description.trim().length > 0
      ) {
        // If CMD+Enter, then save item as new task
        createTask(description, description, date, listId, size);
      }
    },
    [isAdding, description, size],
  );

  const handleOnClick = useCallback((_: React.MouseEvent<HTMLDivElement>) => {
    setIsAdding(true);
    updateState(disableGlobalHotkeys(true));
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === Keys.Meta) {
      keysDown.current.meta = false;
      setIsSaveHintVisible(false);
    }
  }, []);

  return (
    <Container>
      <AddButton ref={addButtonRef} isAdding={isAdding} onClick={handleOnClick}>
        <Plus />
      </AddButton>
      <CreateTextArea
        ref={textAreaRef}
        value={description}
        isAdding={isAdding}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setDescription(e.target.value)
        }
        disabled={loading}
        isLoading={loading}
        isStaged={isSaveHintVisible}
      />
    </Container>
  );
};

export default AddTask;
