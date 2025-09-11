const META_DATA_TYPES = {
  APEX_CLASS: "ApexClass",
  APEX_TRIGGER: "ApexTrigger",
  LIGHTNING_WEB_COMPONENT: "LightningComponentBundle"
};

const META_DATA_DEFINATIONS = {
  [META_DATA_TYPES.APEX_CLASS]: {
    label: "Apex Class",
    directory: "classes",
    suffix: ".cls",
    metaSuffix: ".cls-meta.xml",
    alwaysCreateMeta: true
  },
  [META_DATA_TYPES.APEX_TRIGGER]: {
    label: "Apex Trigger",
    directory: "triggers",
    suffix: ".trigger",
    metaSuffix: ".trigger-meta.xml",
    alwaysCreateMeta: true
  },
  [META_DATA_TYPES.LIGHTNING_WEB_COMPONENT]: {
    label: "Lightning Web Component",
    directory: "lwc",
    suffix: ".js",
    metaSuffix: ".js-meta.xml",
    alwaysCreateMeta: false
  }
};

module.exports = {
  META_DATA_TYPES,
  META_DATA_DEFINATIONS
};
