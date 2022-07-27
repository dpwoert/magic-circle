import styled from 'styled-components';

import {
  Inner,
  TYPO,
  COLORS,
  SPACING,
  Icon,
  MenuPortal,
  Menu,
  Placement,
} from '@magic-circle/styles';

import type { ScreenshotFile } from './index';
import Screenshots from './index';

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center center;
  padding: ${SPACING(1)}px;
  overflow: auto;
  display: flex;
  gap: ${SPACING(2)}px;
  flex-wrap: wrap;
`;

const Screenshot = styled.div`
  ${TYPO.regular}
  height: ${SPACING(25)}px;
  width: calc(25% - ${SPACING(2 * 3) / 4}px);
  color: ${COLORS.shades.s100.css};

  &:nth-child(3),
  &:nth-child(4),
  &:nth-child(5) {
    width: calc(33.33% - ${SPACING(2 * 2) / 3}px);
  }

  &:nth-child(1),
  &:nth-child(2) {
    width: calc(50% - ${SPACING(2) / 2}px);
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
  height: ${SPACING(21)}px;
  border: 1px solid ${COLORS.shades.s400.css};
  border-radius: 5px 5px 0 0;
  object-fit: cover;
  object-position: center center;
  background: ${COLORS.white.css};

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

const Bar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${SPACING(4)}px;
  width: 100%;
  border: 1px solid ${COLORS.shades.s400.css};
  border-radius: 0 0px 5px 5px;
  background: ${COLORS.shades.s700.css};
  color: ${COLORS.shades.s100.css};
  padding: 0 ${SPACING(1)}px;
  border-top: none;
`;

type StarProps = {
  selected: boolean;
};

const Star = styled.div<StarProps>`
  display: flex;
  color: ${(props) => (props.selected ? COLORS.accent.css : COLORS.white.css)};
`;

const Options = styled.div`
  display: flex;
  gap: ${SPACING(0.5)}px;
  cursor: pointer;
  align-items: center;
`;

type GalleryViewProps = {
  screenshots: Screenshots;
  files: ScreenshotFile[];
  reload: () => void;
  close: () => void;
};

const GalleryView = ({
  files,
  screenshots,
  reload,
  close,
}: GalleryViewProps) => {
  return (
    <Inner
      breadcrumbs={{
        plugin: {
          ...screenshots.sidebar(),
        },
        title: 'All screenshots',
      }}
      onClose={close}
    >
      <Container>
        {files.map((file) => {
          const menu: Menu = {
            items: screenshots.commands({
              type: 'screenshot',
              id: file.fileName,
            }),
          };

          return (
            <Screenshot key={file.fileName}>
              <ImageContainer>
                <Image
                  src={file.dataUrl}
                  onClick={() => {
                    screenshots.loadScreenshot(file);
                    close();
                  }}
                />
                <ImageHover>
                  <Icon
                    name="StreamToTv"
                    width={SPACING(2)}
                    height={SPACING(2)}
                  />
                </ImageHover>
              </ImageContainer>
              <Bar>
                {file.fileName}
                <Options>
                  <Star selected={file.data.favourite}>
                    <Icon
                      onClick={() => {
                        screenshots.toggleFavourite(file);
                        reload();
                      }}
                      name="Star"
                      width={SPACING(1.5)}
                      height={SPACING(1.5)}
                    />
                  </Star>
                  <MenuPortal menu={menu} placement={Placement.TOP}>
                    {(toggle) => (
                      <Icon
                        name="DotsVertical"
                        width={SPACING(1.5)}
                        height={SPACING(1.5)}
                        onClick={() => {
                          toggle();
                          // const screen = screenshots.client.getCommandLine({
                          //   type: 'screenshot',
                          //   id: file.fileName,
                          // });
                          // screenshots.client.showCommandLine(screen);
                        }}
                      />
                    )}
                  </MenuPortal>
                </Options>
              </Bar>
            </Screenshot>
          );
        })}
      </Container>
    </Inner>
  );
};

export default GalleryView;
