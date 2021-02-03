export namespace Buffer {
    export function fromString(str: string): Uint8Array {
        const buffer = String.UTF8.encode(str, false);

        // Workaround for https://github.com/AssemblyScript/assemblyscript/issues/1066
        if (buffer.byteLength === 0) return new Uint8Array(0);

        return Uint8Array.wrap(buffer);
    }

    export function toString(arr: Uint8Array): string {
        return String.UTF8.decode(arr.buffer, false);
    }

    /**
     * Returns a pointer to the start of the raw data (i.e. after the header)
     *
     * @see https://docs.assemblyscript.org/details/memory#internals
     */
    export function getDataPtr(arr: Uint8Array): usize {
        return changetype<usize>(arr.buffer) + arr.byteOffset;
    }

    export function readString(arr: Uint8Array, start: usize, end: usize): string {
        return String.UTF8.decodeUnsafe(getDataPtr(arr) + start, end - start);
    }
}
