import { pcharToJSString } from './utils.js';

export const WASI = function() {
  let view = null;
  let moduleInstanceExports = null;
  const WASI_ERRNO_SUCCESS = 0;
  const WASI_ERRNO_BADF = 8;
  const WASI_ERRNO_INVAL = 28;
  const WASI_ERRNO_NOSYS = 52;
  const WASI_STDIN = 0;
  const WASI_STDOUT = 1;
  const WASI_STDERR = 2;

  // Private Helpers
  function refreshMemory() {
    if (!view || view.buffer.byteLength === 0) {
      view = new DataView(moduleInstanceExports.memory.buffer);
    }
  }

  // Public APIs
  function setModuleInstance(instance) {
    moduleInstanceExports = instance.exports;
  }

  function fnfixme(name, result = WASI_ERRNO_SUCCESS) {
    return () => {
      console.log('FIXME', name);
      return result;
    };
  }

  function environ_sizes_get(environCount, environBufSize) {
    refreshMemory();
    view.setUint32(environCount, 0, true);
    view.setUint32(environBufSize, 0, true);
    return WASI_ERRNO_SUCCESS;
  }

  function environ_get(environ, environBuf) {
    return WASI_ERRNO_SUCCESS;
  }

  function fd_fdstat_get(fd, bufPtr) {
    console.log('FIXME', 'fd_fdstat_get');
    refreshMemory();

    view.setUint8(bufPtr, fd);
    view.setUint16(bufPtr + 2, 0, true);
    view.setUint16(bufPtr + 4, 0, true);

    view.setBigUint64(bufPtr + 8, BigInt(0), true);
    view.setBigUint64(bufPtr + 8 + 8, BigInt(0), true);
    return WASI_ERRNO_SUCCESS;
  }

  function fd_write(fd, iovs, iovsLen, nwritten) {
    refreshMemory();
    let bytesWritten = 0;
    let s = '';
    for (let i = 0; i < iovsLen; i++) {
      const ptr = iovs + i * 8;
      const buf = view.getUint32(ptr, true);
      const bufLen = view.getUint32(ptr + 4, true);
      bytesWritten += bufLen;
      s += pcharToJSString(view, moduleInstanceExports.memory.buffer, buf, bufLen);
    };
    if (fd === WASI_STDOUT) {
      console.log(s);
    } else
    if (fd === WASI_STDERR) {
      console.error(s);
    }
    view.setUint32(nwritten, bytesWritten, true);
    return WASI_ERRNO_SUCCESS;
  }

  function proc_exit(rval) {
    if (rval !== 0) {
      throw new Error('Program exit with error code ' + rval);
    }
    return WASI_ERRNO_NOSYS;
  }

  function clock_time_get(id, precision, bufPtr) {
    refreshMemory();
    // We ignore the id & precision of the clock for now
    const date = new Date();
    view.setBigUint64(bufPtr, BigInt(date.getTime()) * BigInt(1000000), true);
    return WASI_ERRNO_SUCCESS;
  }

  return {
    setModuleInstance: setModuleInstance,
    fd_fdstat_get: fd_fdstat_get,
    fd_prestat_get: fnfixme('fd_prestat_get', WASI_ERRNO_BADF),
    fd_prestat_dir_name: fnfixme('fd_prestat_dir_name', WASI_ERRNO_INVAL),
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
