import Vue from 'vue'

import {
  floor,
  merge,
} from 'lodash'

import printf from "printf"

import {
  enableBLOB
} from 'indi-client';

const formatSexaNumber = (value, w, fracbase) => {
  const isNeg = value < 0;
  if (isNeg) {
    value = -value;
  }

  const n = floor(value * fracbase + 0.5);
  const d = floor(n / fracbase);
  const f = n % fracbase;

  let out = "";

  if (isNeg && d == 0) {
    out += printf(`%${w - 2}s-0`, "");
  } else {
    out += printf(`%${w}d`, isNeg ? -d : d);
  }

  let m = 0;
  let s = 0;

  switch (fracbase) {
    case 60:
      m = floor(f / (fracbase / 60));
      out += printf(":%02d", m);
      break;
    case 600:
      out += printf(":%02d.%1d", floor(f / 10), f % 10);
      break;
    case 3600:
      m = floor(f / (fracbase / 60));
      s = f % (fracbase / 60);
      out += printf(":%02d:%02d", m, s);
      break;
    case 36000:
      m = floor(f / (fracbase / 60));
      s = f % (fracbase / 60);
      out += printf(":%02d:%02d.%1d", m, floor(s / 10), s % 10);
      break;
    case 360000:
      m = floor(f / (fracbase / 60));
      s = f % (fracbase / 60);
      out += printf(":%02d:%02d.%02d", m, floor(s / 100), s % 100);
      break;
    default:
      console.warn(`unknown fracbase ${fracbase}`);
      return value;
  }

  return out;
}

const formatNumberValue = (fmt, value) => {
  if (!fmt) {
    return value;
  }

  const checkResult = /%(\d+)\.(\d+)m/.exec(fmt);

  if (checkResult) {
    const w = parseInt(checkResult[1]);
    const f = parseInt(checkResult[2]);

    let s = 60;

    switch (f) {
      case 9:
        s = 360000;
        break;
      case 8:
        s = 36000;
        break;
      case 6:
        s = 3600;
        break;
      case 5:
        s = 600;
        break;
    }

    return formatSexaNumber(value, w - f, s);
  } else {
    return printf(fmt, value);
  }
};

const applyUpdate = (state, payload) => {
  payload = JSON.parse(JSON.stringify(payload));

  const newData = {};
  newData.name = payload.device;
  newData[payload.name] = payload;
  const existing = state.devices[payload.device] ? JSON.parse(JSON.stringify(state.devices[payload.device])) : {};
  const merged = merge(existing, newData);

  if (payload.switches) {
    merged[payload.name].propType = "switch";
  }
  if (payload.numbers) {
    merged[payload.name].propType = "number";
    merged[payload.name].numbers = merged[payload.name].numbers.map(n => {
      return {
        ...n,
        formatted: formatNumberValue(n.format, n.value)
      }
    })
  }
  if (payload.texts) {
    merged[payload.name].propType = "text";
  }
  if (payload.lights) {
    merged[payload.name].propType = "light";
  }
  if (payload.blobs) {
    merged[payload.name].propType = "blob";
  }

  Vue.set(state.devices, payload.device, merged);
}

export default {
  namespaced: true,
  state: () => ({
    devices: {},
    error: null,
    status: 'disconnected',
  }),
  mutations: {
    ["message"]() {
    },
    ["setNumberVector"](state, payload) {
      applyUpdate(state, payload);
    },
    ["setTextVector"](state, payload) {
      applyUpdate(state, payload);
    },
    ["setSwitchVector"](state, payload) {
      applyUpdate(state, payload);
    },
    ["setBLOBVector"](state, payload) {
      applyUpdate(state, payload);
    },
    ["setLightVector"](state, payload) {
      applyUpdate(state, payload);
    },
    ["defTextVector"](state, payload) {
      applyUpdate(state, payload);
    },
    ["defSwitchVector"](state, payload) {
      applyUpdate(state, payload);
    },
    ["defNumberVector"](state, payload) {
      applyUpdate(state, payload);
    },
    ["defLightVector"](state, payload) {
      applyUpdate(state, payload);
    },
    ["defBLOBVector"](state, payload) {
      applyUpdate(state, payload);
    },
    ["newTextVector"](state, payload) {
      applyUpdate(state, payload);
    },
    ["newSwitchVector"](state, payload) {
      applyUpdate(state, payload);
    },
    ["newNumberVector"](state, payload) {
      applyUpdate(state, payload);
    },
    ["newBLOBVector"](state, payload) {
      applyUpdate(state, payload);
    },
    ["delProperty"](state, payload) {
      if (payload.name) {
        const existing = state.devices[payload.device] ? JSON.parse(JSON.stringify(state.devices[payload.device])) : {};
        delete existing[payload.name];
        Vue.set(state.devices, payload.device, existing);
      } else {
        delete state.devices[payload.device];
      }
    },
    ["statusUpdate"](state, payload) {
      applyUpdate(state, payload);
    },
    ["indi_client_connected"](state) {
      state.status = "connected";
      state.error = null;

      this.dispatch("indi/subscribe");
    },
    ["indi_client_closed"](state) {
      state.status = "disconnected";
    },
    ["indi_client_error"](state, payload) {
      state.error = payload;
    },
    ["indi_client_reconnecting"](state) {
      state.status = "reconnecting";
    },
  },
  actions: {
    subscribe: ({dispatch}) => {
      dispatch("sendCommand", {type: "getProperties", data: {}});
      dispatch("sendCommand", {type: "enableBLOB", data: new enableBLOB("", "", "Never")});
    },

    sendCommand: (context, {type, data}) => {
      if (type.startsWith("new")) {
        context.commit("statusUpdate", {
          device: data.device,
          name: data.name,
          state: "Busy",
        });
      }

      Vue.prototype.$socket.send(JSON.stringify({
        type: type,
        payload: data,
      }));
    }
  },
};
