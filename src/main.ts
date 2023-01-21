export default class PseudoThread extends Worker {
	constructor(public fn: (ctx: WindowOrWorkerGlobalScope) => void) {
		if (!('Worker' in window)) throw Error('ParallelThread(...) Browser need to support Web Workers')

		const blob = URL.createObjectURL(new Blob([`(${fn.toString()})(this)`], { type: 'text/javascript' }))
		super(blob)
	}
}
