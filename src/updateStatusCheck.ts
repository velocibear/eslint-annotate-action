import constants from './constants'
const {octokit} = constants
import type {checkUpdateParametersType, updateCheckRunResponseDataType} from './types'

/**
 * Update a GitHub check run
 * @param options the parameter for octokit.checks.update
 */
export default async function updateStatusCheck(
  options: checkUpdateParametersType,
): Promise<updateCheckRunResponseDataType> {
  try {
    // https://developer.github.com/v3/checks/runs/#update-a-check-run
    // https://octokit.github.io/rest.js/v18#checks-update
    const response = await octokit.request('PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}', options)
    return Promise.resolve(response.data)
  } catch (error) {
    return Promise.reject(error)
  }
}
