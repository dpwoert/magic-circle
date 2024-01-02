import React, { useContext } from 'react';
import styled from 'styled-components';

import { AppContext } from '@magic-circle/state';

import SPACING from './spacing';
import COLORS from './colors';
import TYPO from './typography';
import Icon, { IconName, register as registerIcon } from './Icon';

import { Close as CloseIcon } from './assets/icons';

registerIcon(CloseIcon);

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${COLORS.shades.s500.css};
`;

const Breadcrumbs = styled.div`
  position: sticky;
  height: ${SPACING(5)}px;
  background: ${COLORS.shades.s400.css};
  border-bottom: 1px solid ${COLORS.shades.s300.css};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${SPACING(1)}px;
`;

const Side = styled.div`
  display: flex;
  align-items: center;
`;

const BreadcrumbsPlugin = styled.div`
  ${TYPO.regular}
  display: flex;
  align-items: center;
  height: ${SPACING(3)}px;
  padding: 0 ${SPACING(1)}px;
  gap: ${SPACING(1)}px;
  margin-right: ${SPACING(1)}px;
  background: ${COLORS.shades.s600.css};
  color: ${COLORS.shades.s100.css};
  border: 1px solid ${COLORS.shades.s300.css};
  border-radius: 3px;
`;

const Title = styled.div`
  ${TYPO.regular}
  color: ${COLORS.shades.s100.css};
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: ${SPACING(2)}px;
  margin-right: ${SPACING(2)}px;
`;

const Button = styled.div`
  ${TYPO.regular}
  display: flex;
  align-items: center;
  gap: ${SPACING(1)}px;
  color: ${COLORS.shades.s100.css};
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${COLORS.white.css};
  }
`;

const Close = styled.div`
  width: ${SPACING(2)}px;
  height: ${SPACING(2)}px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${COLORS.accent.opacity(0.7)};
  border-radius: 5px;
  background: ${COLORS.shades.s600.css};
  color: ${COLORS.white.css};
  cursor: pointer;
  z-index: 9;
  transition: border-color 0.2s ease;

  &:hover {
    border: 1px solid ${COLORS.accent.opacity(1)};
  }
`;

const Content = styled.div`
  position: absolute;
  width: 100%;
  height: calc(100% - ${SPACING(5)}px);
  object-fit: contain;
  object-position: center center;
  overflow: auto;
`;

type InnerProps = {
  children: React.ReactNode;
  breadcrumbs: {
    plugin: {
      icon: IconName;
      name: string;
    };
    title: string;
  };
  buttons?: {
    label: string;
    icon: IconName;
    onClick: () => void;
    hide?: boolean;
  }[];
  onClose?: () => void;
};

const Inner = ({ children, breadcrumbs, buttons, onClose }: InnerProps) => {
  const app = useContext(AppContext);

  return (
    <Container>
      <Breadcrumbs>
        <Side>
          <BreadcrumbsPlugin>
            <Icon
              name={breadcrumbs.plugin.icon}
              width={SPACING(1.5)}
              height={SPACING(1.5)}
            />
            {breadcrumbs.plugin.name}
          </BreadcrumbsPlugin>
          <Title>{breadcrumbs.title}</Title>
        </Side>
        <Side>
          {buttons && (
            <Buttons>
              {buttons
                .filter((button) => !button.hide)
                .map((button) => (
                  <Button key={button.label} onClick={button.onClick}>
                    <Icon
                      name={button.icon}
                      width={SPACING(1.5)}
                      height={SPACING(1.5)}
                    />
                    {button.label}
                  </Button>
                ))}
            </Buttons>
          )}
          <Close
            onClick={() => {
              if (app) {
                app.layoutHooks.set({
                  ...app.layoutHooks.value,
                  inner: undefined,
                });
              }

              if (onClose) onClose();
            }}
          >
            <Icon name="Close" width={SPACING(1.5)} height={SPACING(1.5)} />
          </Close>
        </Side>
      </Breadcrumbs>
      <Content>{children}</Content>
    </Container>
  );
};

export default Inner;
