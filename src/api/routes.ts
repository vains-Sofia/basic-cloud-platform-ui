import { systemManagementRouter } from "../../mock/asyncRoutes";

// type Result = {
//   success: boolean;
//   data: Array<any>;
// };

export const getAsyncRoutes = () => {
  return new Promise(resolve => {
    resolve({
      success: true,
      data: [systemManagementRouter]
    });
  });
};
