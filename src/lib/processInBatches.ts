/**
 * Processes an async iterable in sequential, bounded-size batches.
 *
 * @param {AsyncIterable<T>} items - The items to process.
 * @param {number} batchSize - The maximum number of items in a batch.
 * @param {(batch: T[]) => Promise<void>} processBatch - The batch processor.
 * @returns {Promise<number>} The number of processed items.
 */
export async function processInBatches<T> (
	items: AsyncIterable<T>,
	batchSize: number,
	processBatch: (batch: T[]) => Promise<void>,
): Promise<number> {
	if (!Number.isInteger(batchSize) || batchSize < 1) throw new RangeError(`Batch size must be a positive integer`)

	let batch: T[] = []
	let itemCount = 0

	for await (let item of items) {
		batch.push(item)
		itemCount += 1

		if (batch.length === batchSize) {
			await processBatch(batch)
			batch = []
		}
	}

	if (batch.length > 0) await processBatch(batch)

	return itemCount
}
