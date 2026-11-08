import { describe, expect, it, vi } from "vitest"

import { processInBatches } from "./processInBatches.ts"

describe(`processInBatches`, () => {
	it(`should process ordered bounded batches and return the item count`, async () => {
		let processedItems: number[] = []
		let batchSizes: number[] = []
		let processBatch = vi.fn(async (batch: number[]) => {
			await Promise.resolve()
			batchSizes.push(batch.length)
			processedItems.push(...batch)
		})

		let itemCount = await processInBatches(createItems(10), 3, processBatch)

		expect(itemCount).toBe(10)
		expect(batchSizes).toEqual([3, 3, 3, 1])
		expect(processedItems).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
	})

	it(`should not invoke the batch processor for an empty iterable`, async () => {
		let processBatch = vi.fn(async (batch: number[]) => {
			await Promise.resolve()
			expect(batch.length).toBeGreaterThan(0)
		})

		await expect(processInBatches(createItems(0), 3, processBatch)).resolves.toBe(0)
		expect(processBatch).not.toHaveBeenCalled()
	})

	it.each([0, -1, 1.5])(`should reject invalid batch size %s`, async (batchSize) => {
		await expect(processInBatches(createItems(1), batchSize, async (batch: number[]) => {
			await Promise.resolve()
			expect(batch.length).toBeGreaterThan(0)
		}))
			.rejects
			.toThrow(`Batch size must be a positive integer`)
	})
})

async function* createItems (count: number): AsyncGenerator<number> {
	for (let index = 0; index < count; index += 1) yield index
}
