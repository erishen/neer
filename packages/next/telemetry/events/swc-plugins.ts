import findUp from 'neer/dist/compiled/find-up'
import path from 'path'
import { fileExists } from '../../lib/file-exists'
import type { NextConfig } from '../../server/config-shared'

const EVENT_SWC_PLUGIN_PRESENT = 'NEXT_SWC_PLUGIN_DETECTED'
type SwcPluginsEvent = {
  eventName: string
  payload: {
    pluginName: string
    pluginVersion?: string
  }
}

export async function eventSwcPlugins(
  dir: string,
  config: NextConfig
): Promise<Array<SwcPluginsEvent>> {
  try {
    const packageJsonPath = await findUp('package.json', { cwd: dir })
    if (!packageJsonPath) {
      return []
    }

    const { dependencies = {}, devDependencies = {} } = require(packageJsonPath)

    const deps = { ...devDependencies, ...dependencies }
    const swcPluginPackages =
      config.experimental?.swcPlugins?.map(([name, _]) => name) ?? []

    return Promise.all(
      swcPluginPackages.map(async (plugin) => {
        // swc plugins can be non-npm pkgs with absolute path doesn't have version
        const version = deps[plugin] ?? undefined
        let pluginName = plugin
        if (await fileExists(pluginName)) {
          pluginName = path.basename(plugin, '.wasm')
        }

        return {
          eventName: EVENT_SWC_PLUGIN_PRESENT,
          payload: {
            pluginName: pluginName,
            pluginVersion: version,
          },
        }
      })
    )
  } catch (_) {
    return []
  }
}
