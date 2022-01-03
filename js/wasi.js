export const WASI = function() {
  let moduleInstanceExports = null;
  const WASI_ESUCCESS = 0;
  const WASI_EBADF = 8;
  const WASI_EINVAL = 28;
  const WASI_ENOSYS = 52;
  const WASI_STDIN = 0;
  const WASI_STDOUT = 1;
  const WASI_STDERR = 2;

  // Private Helpers
  function getModuleMemoryDataView() {
    return new DataView(moduleInstanceExports.memory.buffer);
  }

  // Public APIs
  function setModuleInstance(instance) {
    moduleInstanceExports = instance.exports;
  }

  function fnfixme(name) {
    return () => {
      console.log('FIXME', name);
      return WASI_ESUCCESS;
    };
  }

  function environ_sizes_get(environCount, environBufSize) {
    const view = getModuleMemoryDataView();
    view.setUint32(environCount, 0, true);
    view.setUint32(environBufSize, 0, true);
    return WASI_ESUCCESS;
  }

  function environ_get(environ, environBuf) {
    return WASI_ESUCCESS;
  }

  function fd_prestat_get(fd, bufPtr) {
    return WASI_EBADF;
  }

  function fd_prestat_dir_name(fd, pathPtr, pathLen) {
    return WASI_EINVAL;
  }

  function fd_fdstat_get(fd, bufPtr) {
    const view = getModuleMemoryDataView();

    view.setUint8(bufPtr, fd);
    view.setUint16(bufPtr + 2, 0, true);
    view.setUint16(bufPtr + 4, 0, true);

    view.setBigUint64(bufPtr + 8, BigInt(0), true);
    view.setBigUint64(bufPtr + 8 + 8, BigInt(0), true);
    return WASI_ESUCCESS;
  }

  function fd_write(fd, iovs, iovsLen, nwritten) {
    const view = getModuleMemoryDataView();
    const buffers = Array.from({ length: iovsLen }, (_, i) => {
      const ptr = iovs + i * 8;
      const buf = view.getUint32(ptr, true);
      const bufLen = view.getUint32(ptr + 4, true);
      return new Uint8Array(moduleInstanceExports.memory.buffer, buf, bufLen);
    });
    const bufferBytes = [];
    for (let j = 0; j < buffers.length; j++) {
      const iov = buffers[j];
      for (let i = 0; i < iov.byteLength; i++) {
        bufferBytes.push(iov[i]);
      }
    }
    if (fd === WASI_STDOUT) {
      console.log(String.fromCharCode.apply(null, bufferBytes));
    } else
    if (fd === WASI_STDERR) {
      console.error(String.fromCharCode.apply(null, bufferBytes));
    }
    view.setUint32(nwritten, bufferBytes.length, true);
    return WASI_ESUCCESS;
  }

  function proc_exit(rval) {
    if (rval !== 0) {
      throw new Error('Program exit with error code ' + rval);
    }
    return WASI_ENOSYS;
  }

  function clock_time_get(id, precision, bufPtr) {
    const view = getModuleMemoryDataView();
    // We ignore the id & precision of the clock for now
    const date = new Date();
    view.setBigUint64(bufPtr, BigInt(date.getTime() * 1000000), true);
    return WASI_ESUCCESS;
  }

  return {
    setModuleInstance: setModuleInstance,
    fd_fdstat_get: fd_fdstat_get,
    fd_prestat_get: fd_prestat_get,
    fd_prestat_dir_name: fd_prestat_dir_name,
    environ_sizes_get: environ_sizes_get,
    environ_get: environ_get,
    fd_open: fnfixme('fd_open'),
    fd_close: fnfixme('fd_close'),
    fd_seek: fnfixme('fd_seek'),
    fd_read: fnfixme('fd_read'),
    fd_write: fd_write,
    fd_tell: fnfixme('fd_tell'),
    fd_filestat_get: fnfixme('fd_filestat_get'),
    path_readlink: fnfixme('path_readlink'),
    path_open: fnfixme('path_open'),
    proc_exit: proc_exit,
    clock_time_get: clock_time_get,
  };
};
