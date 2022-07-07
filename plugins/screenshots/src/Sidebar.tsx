import { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';

import {
  COLORS,
  Icon,
  Metric,
  SPACING,
  TYPO,
  Warning,
} from '@magic-circle/styles';
import { useStore } from '@magic-circle/state';
import { App, LayoutHook } from '@magic-circle/schema';

import Screenshots, { ReadMode, ScreenshotFile } from './index';
import GalleryView from './GalleryView';

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: ${SPACING(1) - 4}px;
  padding-right: ${SPACING(1)}px;
  height: ${SPACING(5)}px;
  border-top: 1px solid ${COLORS.shades.s300.css};
  border-bottom: 1px solid ${COLORS.shades.s300.css};
  background: ${COLORS.black.css};
  color: ${COLORS.shades.s200.css};
`;

const HeaderFilters = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

type HeaderFilterProps = {
  selected?: boolean;
};

const HeaderFilter = styled.div<HeaderFilterProps>`
  ${TYPO.small}
  display: flex;
  align-items: center;
  gap: ${SPACING(0.5)}px;
  padding: 0 4px;
  height: ${SPACING(2)}px;
  border-radius: 5px;
  color: ${(props) =>
    props.selected ? COLORS.white.css : COLORS.shades.s200.css};
  background: ${(props) =>
    props.selected
      ? COLORS.shades.s500.opacity(1)
      : COLORS.shades.s500.opacity(0)};
  transition: background-color 0.2s ease, color 0.2s ease;
  cursor: pointer;
`;

const HeaderFilterAll = styled.div<HeaderFilterProps>`
  color: ${(props) =>
    props.selected ? COLORS.accent.css : COLORS.shades.s200.css};

  &:hover {
    color: ${(props) =>
      props.selected ? COLORS.accent.css : COLORS.white.css};
  }
`;

const FileContainer = styled.div`
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

const FileHeaderStar = styled.div<HeaderFilterProps>`
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

const ImageHover = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${COLORS.black.opacity(0)};
  transition: background 0.2s ease;
  pointer-events: none;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: ${SPACING(11)}px;
  border-bottom: 1px solid ${COLORS.shades.s300.css};
  object-fit: cover;
  object-position: center center;

  &:hover ${ImageHover} {
    background: ${COLORS.black.opacity(0.7)};
  }

  svg {
    color: ${COLORS.white.css};
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover svg {
    opacity: 1;
  }
`;

const Image = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
`;

type FileProps = {
  load: (screenshot: ScreenshotFile) => void;
  preview: (screenshot: ScreenshotFile) => void;
  json: (screenshot: ScreenshotFile) => void;
  favourite: (screenshot: ScreenshotFile) => void;
  remove: (screenshot: ScreenshotFile) => void;
  rename: (screenshot: ScreenshotFile) => void;
  file: ScreenshotFile;
};

const File = ({
  file,
  preview,
  json,
  load,
  favourite,
  remove,
  rename,
}: FileProps) => {
  const [expand, setExpand] = useState(false);
  return (
    <FileContainer>
      <FileHeader>
        <Title>{file.name}</Title>
        <Icons>
          <FileHeaderStar selected={file.data.favourite}>
            <Icon
              name="Star"
              width={SPACING(1.5)}
              height={SPACING(1.5)}
              onClick={() => {
                favourite(file);
              }}
            />
          </FileHeaderStar>
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
          <Option onClick={() => preview(file)}>
            <Icon name="Photo" width={SPACING(1)} height={SPACING(1)} />
            View screenshot
          </Option>
          <Option onClick={() => json(file)}>
            <Icon name="Information" width={SPACING(1)} height={SPACING(1)} />
            Show file info
          </Option>
          <Option onClick={() => rename(file)}>
            <Icon name="Tag" width={SPACING(1)} height={SPACING(1)} />
            Rename
          </Option>
          <Option onClick={() => remove(file)}>
            <Icon name="Trash" width={SPACING(1)} height={SPACING(1)} />
            Delete
          </Option>
        </Options>
      )}
      <ImageContainer>
        <Image
          src={file.dataUrl}
          onClick={() => {
            load(file);
          }}
        />
        <ImageHover>
          <Icon name="StreamToTv" width={SPACING(2)} height={SPACING(2)} />
        </ImageHover>
      </ImageContainer>
    </FileContainer>
  );
};

type SidebarProps = {
  app: App;
  screenshots: Screenshots;
};

const Sidebar = ({ app, screenshots }: SidebarProps) => {
  const lastScreenshot = useStore(screenshots.last);
  const [files, setFiles] = useState<ScreenshotFile[]>([]);
  const [mode, _setMode] = useState(ReadMode.RECENT);

  const [isLoading, setIsLoading] = useState(true);
  const [hasDirectory, setHasDirectory] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  const read = useCallback(async () => {
    const dir = await screenshots.getDirectory(false);

    if (!dir) {
      setHasDirectory(false);
      setHasAccess(false);
      setIsLoading(false);
      setFiles([]);
      return;
    }

    const permission = await dir.queryPermission();
    const hasPermission = permission === 'granted';

    if (!hasPermission) {
      setHasDirectory(true);
      setHasAccess(false);
      setIsLoading(false);
      setFiles([]);
      return;
    }

    const list = await screenshots.readDirectory(mode);
    setHasDirectory(true);
    setHasAccess(true);
    setIsLoading(false);
    setFiles(list);
  }, [screenshots, mode]);

  const setMode = useCallback(
    (newMode: ReadMode) => {
      _setMode(newMode);

      if (newMode === ReadMode.ALL) {
        app.setLayoutHook(
          LayoutHook.INNER,
          <GalleryView
            close={() => {
              app.setLayoutHook(LayoutHook.INNER, null);
              setMode(ReadMode.RECENT);
            }}
            reload={read}
            screenshots={screenshots}
            files={files}
          />
        );
      } else {
        app.setLayoutHook(LayoutHook.INNER, null);
      }
    },
    [app, files, screenshots, read]
  );

  useEffect(() => {
    read();
  }, [read]);

  useEffect(() => {
    read();
  }, [lastScreenshot]); // eslint-disable-line

  if ('showOpenFilePicker' in window === false) {
    return (
      <Warning text="This functionality is currently not support in Firefox" />
    );
  }

  if (isLoading) {
    return null;
  }

  if (!hasDirectory) {
    return (
      <Warning
        text="No folder selected for storing screenshots, select one first"
        button={{
          icon: 'Folder',
          label: 'Select folder',
          onClick: async () => {
            await screenshots.changeFolder();
            read();
          },
        }}
      />
    );
  }

  if (!hasAccess) {
    return (
      <Warning
        text="Permission needed to view your folder containing screenshots"
        button={{
          icon: 'CheckCircle',
          label: 'Give access',
          onClick: async () => {
            const dir = await screenshots.getDirectory();
            await screenshots.verifyPermission(dir, false);
            read();
          },
        }}
      />
    );
  }

  return (
    <div>
      <Header>
        <HeaderFilters>
          <HeaderFilter
            selected={mode === ReadMode.RECENT}
            onClick={() => setMode(ReadMode.RECENT)}
          >
            <Icon name="Clock" width={SPACING(1.5)} height={SPACING(1.5)} />
            Recent
          </HeaderFilter>
          <HeaderFilter
            selected={mode === ReadMode.FAVOURITES}
            onClick={() => setMode(ReadMode.FAVOURITES)}
          >
            <Icon name="Star" width={SPACING(1.5)} height={SPACING(1.5)} />
            Starred
          </HeaderFilter>
        </HeaderFilters>
        <HeaderFilterAll
          onClick={() => setMode(ReadMode.ALL)}
          selected={mode === ReadMode.ALL}
        >
          <Icon name="Folder" width={SPACING(1.5)} height={SPACING(1.5)} />
        </HeaderFilterAll>
      </Header>
      {mode === ReadMode.ALL ? (
        <>
          <Metric.Container>
            No screenshots<Metric.Value>{files.length}</Metric.Value>
          </Metric.Container>
        </>
      ) : (
        files.map((file) => (
          <File
            key={file.fileName}
            file={file}
            load={screenshots.loadScreenshot}
            preview={screenshots.previewImage}
            favourite={async () => {
              await screenshots.toggleFavourite(file);
              read();
            }}
            rename={async () => {
              await screenshots.renameScreenshot(file);
              read();
            }}
            remove={async () => {
              await screenshots.deleteScreenshot(file);
              read();
            }}
            json={screenshots.jsonViewer}
          />
        ))
      )}
    </div>
  );
};

export default Sidebar;
