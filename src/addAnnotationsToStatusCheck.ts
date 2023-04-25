import updateStatusCheck from './updateStatusCheck'
import type {ChecksUpdateParamsOutputAnnotations, createCheckRunResponseDataType} from './types'
import constants from './constants'
const {OWNER, REPO, toolkit: tools, checkName} = constants

/**
 * Add annotations to an existing GitHub check run
 * @param annotations an array of annotation objects. See https://developer.github.com/v3/checks/runs/#annotations-object-1
 * @param checkId the ID of the check run to add annotations to
 */
export default async function addAnnotationsToStatusCheck(
  annotations: ChecksUpdateParamsOutputAnnotations[],
  checkId: createCheckRunResponseDataType['id'],
): Promise<Array<createCheckRunResponseDataType>> {
  /**
   * Update the GitHub check with the
   * annotations from the report analysis.
   *
   * If there are more than 50 annotations
   * we need to make multiple API requests
   * to avoid rate limiting errors
   *
   * See https://developer.github.com/v3/checks/runs/#output-object-1
   */
  const numberOfAnnotations = annotations.length
  const batchSize = 50
  const numBatches = Math.ceil(numberOfAnnotations / batchSize)
  const checkUpdatePromises = []
  for (let batch = 1; batch <= numBatches; batch++) {
    const batchMessage = `Found ${numberOfAnnotations} ESLint errors and warnings, processing batch ${batch} of ${numBatches}...`
    tools.log.info(batchMessage)
    const annotationBatch = annotations.splice(0, batchSize)
    try {
      const currentCheckPromise = updateStatusCheck({
        owner: OWNER,
        repo: REPO,
        check_run_id: checkId,
        status: 'in_progress',
        output: {
          title: checkName,
          summary: batchMessage,
          annotations: annotationBatch,
        },
      })
      checkUpdatePromises.push(currentCheckPromise)
    } catch (err) {
      const errorMessage = `Error adding anotations to the GitHub status check with ID: ${checkId}`
      // err only has an error message if it is an instance of Error
      if (err instanceof Error) {
        tools.exit.failure(err.message ? err.message : errorMessage)
      } else {
        tools.exit.failure(errorMessage)
      }
    }
  }
  return Promise.all(checkUpdatePromises)
}
