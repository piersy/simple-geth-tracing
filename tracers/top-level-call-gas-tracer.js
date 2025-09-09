// This tracer logs the call target and gas used by top level calls.
let tracer = {
  calls: [],
  targetDepth: 1,
  prevDepth: 0,

  array2Hex: function (arr) {
    var retVal = "";
    for (var i = 0; i < arr.length; i++) {
      retVal += this.byte2Hex(arr[i]);
    }
    return retVal;
  },

  byte2Hex: function (byte) {
    if (byte < 0x10)
      return "0" + byte.toString(16);
    return byte.toString(16);
  },

  step: function (log, db) {
    // Capture gas before making a call
    if (log.op.toString() === 'CALL' && log.getDepth() === this.targetDepth) {
      // let address = log.stack.peek(1);
      let address = "0x" + this.byte2Hex(log.stack.peek(1));
      this.calls.push({ address: address, gas: log.getGas() });
    }
    // Capture gas after returning from a call
    if (log.getDepth() === this.targetDepth && this.prevDepth > this.targetDepth) {
      let call = this.calls[this.calls.length - 1];
      call.gas -= log.getGas();
    }
    this.prevDepth = log.getDepth();
  },

  fault: function (log) {
  },

  result: function () {
    return this.calls;
  }
}
