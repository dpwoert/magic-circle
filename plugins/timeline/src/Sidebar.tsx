import { useState } from 'react';
import styled from 'styled-components';

import { useStore } from '@magic-circle/state';
import {
  SPACING,
  COLORS,
  TYPO,
  Icon,
  Forms,
  MenuPortal,
  Menu,
} from '@magic-circle/styles';

import type Timeline from './index';
import type { Scene } from './index';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SceneContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${COLORS.white.css};
`;

const FileHeader = styled.div`
  ${TYPO.regular}
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${SPACING(4)}px;
  padding: 0 ${SPACING(1)}px;
  border-bottom: 1px solid ${COLORS.shades.s300.css};
  color: ${COLORS.white.css};
  background: ${COLORS.shades.s600.css};
`;

type IconButtonProps = {
  selected?: boolean;
};

const IconButton = styled.div<IconButtonProps>`
  color: ${(props) => (props.selected ? COLORS.accent.css : COLORS.white.css)};
`;

const Title = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Icons = styled.div`
  display: flex;
  gap: ${SPACING(0.5)}px;
  padding-left: ${SPACING(2)}px;
  flex-shrink: 0;

  svg {
    transition: color 0.2s ease;
    cursor: pointer;
  }

  svg:hover {
    color: ${COLORS.accent.css};
  }
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
`;

const Option = styled.div`
  ${TYPO.small}
  display: flex;
  justify-content: flex-start;
  gap: ${SPACING(1)}px;
  align-items: center;
  height: ${SPACING(3)}px;
  padding: 0 ${SPACING(1)}px;
  border-bottom: 1px solid ${COLORS.shades.s300.css};
  color: ${COLORS.white.css};
  background: ${COLORS.shades.s700.css};
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${COLORS.accent.css};
  }
`;

const ButtonArea = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${SPACING(2)}px;
`;

type SceneEntryProps = {
  scene: Scene;
  id: string;
  timeline: Timeline;
};

const SceneEntry = ({ scene, id, timeline }: SceneEntryProps) => {
  const [expand, setExpand] = useState(false);
  return (
    <SceneContainer>
      <FileHeader>
        <Title>{scene.name}</Title>
        <Icons>
          <IconButton selected={false}>
            <Icon
              name="Edit"
              width={SPACING(1.5)}
              height={SPACING(1.5)}
              onClick={() => {
                timeline.editScene(id);
                timeline.show.set(true);
              }}
            />
          </IconButton>
          <Icon
            name="DotsVertical"
            width={SPACING(1.5)}
            height={SPACING(1.5)}
            onClick={() => {
              setExpand(!expand);
            }}
          />
        </Icons>
      </FileHeader>
      {expand && (
        <Options>
          <Option
            onClick={() => {
              timeline.exportScene(id);
            }}
          >
            <Icon name="Share" width={SPACING(1)} height={SPACING(1)} />
            Export
          </Option>
          <Option
            onClick={() => {
              timeline.duplicateScene(id);
            }}
          >
            <Icon name="Copy" width={SPACING(1)} height={SPACING(1)} />
            Duplicate
          </Option>
          <Option
            onClick={() => {
              // eslint-disable-next-line
              const newName = prompt(
                'Which name do you want to give this scene?',
                scene.name
              );

              if (newName) {
                timeline.renameScene(id, newName);
              }
            }}
          >
            <Icon name="Tag" width={SPACING(1)} height={SPACING(1)} />
            Rename
          </Option>
          <Option
            onClick={() => {
              timeline.deleteScene(id);
            }}
          >
            <Icon name="Trash" width={SPACING(1)} height={SPACING(1)} />
            Delete
          </Option>
        </Options>
      )}
    </SceneContainer>
  );
};

type SidebarProps = {
  timeline: Timeline;
};

const Sidebar = ({ timeline }: SidebarProps) => {
  const scenes = useStore(timeline.scenes);

  const menu: Menu = {
    items: [
      {
        label: 'New empty scene',
        icon: 'FilePlus',
        onSelect: () => {
          timeline.createNewScene();
        },
      },
      {
        label: 'Import from file',
        icon: 'Download',
        onSelect: () => {
          timeline.importScene();
        },
      },
    ],
  };

  return (
    <Container>
      {Object.keys(scenes).map((id) => (
        <SceneEntry key={id} id={id} scene={scenes[id]} timeline={timeline} />
      ))}
      <ButtonArea>
        <MenuPortal menu={menu}>
          {(toggle) => (
            <Forms.Button
              highlight
              onClick={() => {
                toggle();
              }}
            >
              <Icon name="Plus" width={SPACING(1.5)} height={SPACING(1.5)} />
              Add new scene
            </Forms.Button>
          )}
        </MenuPortal>
      </ButtonArea>
    </Container>
  );
};

export default Sidebar;
