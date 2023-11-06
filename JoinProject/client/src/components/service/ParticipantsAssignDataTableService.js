

import * as constant from "../../constant.js";

export const ParticipantsAssignDataTableService = {
  async getParticipantsData(courseToken) {
    return await fetch(`${constant.URL_API}/courses/get-users`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseToken
        }),
      })
        .then((res) => res.json())
        .then((data) => {
            return data.participants;
        })
        .catch((err) => err);
  },
  getParticipants({lazyEvent, courseToken}) {
    console.log(lazyEvent)
    return Promise.resolve(this.getParticipantsData(courseToken));
  },
};
