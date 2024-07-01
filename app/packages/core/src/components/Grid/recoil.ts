import { atom, selector } from "recoil";

import * as fos from "@fiftyone/state";

export const defaultGridZoom = selector<number>({
  key: "defaultGridZoom",
  get: ({ get }) => get(fos.config)?.gridZoom,
});

export const gridPage = atom({
  key: "gridPage",
  default: 0,
});

export const gridZoom = atom<number>({
  key: "gridZoom",
  default: defaultGridZoom,
});

export const gridZoomRange = atom<[number, number]>({
  key: "gridZoomRange",
  default: [0, 10],
});

export const rowAspectRatioThreshold = selector<number>({
  key: "rowAspectRatioThreshold",
  get: ({ get }) => 11 - Math.max(get(gridZoom), get(gridZoomRange)[0]),
});

export const gridCropCallback = selector({
  key: "gridCropCallback",
  get: ({ getCallback }) => {
    return getCallback(({ snapshot }) => async () => {
      return (
        (await snapshot.getPromise(fos.isPatchesView)) &&
        (await snapshot.getPromise(fos.cropToContent(false)))
      );
    });
  },
});

export const gridCrop = selector({
  key: "gridCrop",
  get: ({ get }) => {
    return get(fos.isPatchesView) && get(fos.cropToContent(false));
  },
});

export const pageParameters = selector({
  key: "paginateGridVariables",
  get: ({ get }) => {
    const slice = get(fos.groupSlice);
    const dataset = get(fos.datasetName);

    if (!dataset) {
      throw new Error("dataset is not defined");
    }
    const params = {
      dataset,
      view: get(fos.view),
      filters: get(fos.filters),
      filter: {
        group: slice
          ? {
              slice,
              slices: [slice],
            }
          : null,
      },
      extendedStages: get(fos.extendedStages),
    };
    return (page: number, pageSize: number) => {
      return {
        ...params,
        after: page ? String(page * pageSize) : null,
        first: pageSize,
      };
    };
  },
});

export const showGridPixels = atom({ key: "showGridPixels", default: false });
