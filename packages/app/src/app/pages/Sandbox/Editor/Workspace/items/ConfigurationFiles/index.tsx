import React from 'react';
import {
  Element,
  Collapsible,
  Text,
  Button,
  Stack,
  Grid as BaseGrid,
} from '@codesandbox/components/lib/';
import getDefinition from '@codesandbox/common/lib/templates';
import { resolveModule } from '@codesandbox/common/lib/sandbox/modules';

import { useOvermind } from 'app/overmind';
import styled from 'styled-components';
import { NetlifyIcon, PrettierIcon, NPMIcon, ZeitIcon } from './Icons';

const getIcon = name => {
  const icons = {
    'netlify.toml': NetlifyIcon,
    'package.json': NPMIcon,
    'now.json': ZeitIcon,
    '.prettierrc': PrettierIcon,
  };

  return icons[name] || NPMIcon;
};

const Grid = styled(BaseGrid)`
  grid-template-columns: 1fr 100px;
  grid-gap: 16px;
`;

export const ConfigurationFiles = () => {
  const {
    state: {
      editor: { currentSandbox },
    },
    actions: { files, editor },
  } = useOvermind();

  const { configurationFiles } = getDefinition(currentSandbox.template);

  const createdPaths = {};
  const restPaths = {};

  Object.keys(configurationFiles)
    .sort()
    .forEach(p => {
      const config = configurationFiles[p];

      try {
        const module = resolveModule(
          p,
          currentSandbox.modules,
          currentSandbox.directories
        );
        createdPaths[p] = {
          config,
          module,
        };
      } catch (e) {
        restPaths[p] = {
          config,
        };
      }
    });

  return (
    <>
      <Collapsible title="Configuration Files" defaultOpen>
        <Stack direction="vertical" gap={6} style={{ padding: '0 8px' }}>
          <Element>
            <Text as="div" marginBottom={2}>
              Configuration your Sandbox
            </Text>
            <Text variant="muted">
              Codesandbox supports several config giles per template, you van
              see and edit all supported files for the current sandbox here.
            </Text>
          </Element>
          <Stack direction="vertical" gap={4}>
            {Object.keys(createdPaths).map(path => {
              const { config, module } = createdPaths[path];
              const Icon = getIcon(config.title);
              return (
                <Element>
                  <Stack gap={2} marginBottom={2}>
                    <Icon />
                    <Text size={2}>{config.title}</Text>
                  </Stack>
                  <Grid>
                    <Text size={2} variant="muted">
                      {config.description}
                    </Text>
                    <Button
                      style={{ width: 'auto' }}
                      variant="secondary"
                      onClick={() => editor.moduleSelected({ id: module.id })}
                    >
                      Edit
                    </Button>
                  </Grid>
                </Element>
              );
            })}
          </Stack>
        </Stack>
      </Collapsible>
      <Collapsible title="Other Configuration" defaultOpen>
        <Stack direction="vertical" gap={4} style={{ padding: '0 8px' }}>
          {Object.keys(restPaths).map(path => {
            const { config } = restPaths[path];
            const Icon = getIcon(config.title);
            return (
              <Element>
                <Stack gap={2} marginBottom={2}>
                  <Icon />
                  <Text size={2}>{config.title}</Text>
                </Stack>
                <Grid>
                  <Text size={2} variant="muted">
                    {config.description}
                  </Text>
                  <Button
                    style={{ width: 'auto' }}
                    variant="secondary"
                    onClick={() =>
                      files.moduleCreated({
                        title: config.title,
                        directoryShortid: null,
                      })
                    }
                  >
                    Create File
                  </Button>
                </Grid>
              </Element>
            );
          })}
        </Stack>
      </Collapsible>
    </>
  );
};
