const { DateTime } = require('luxon');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DateSchema = new Schema({
  date: {type: Date, required: true}
})

DateSchema
  .virtual('formatted_date')
  .get(function() {
    return DateTime
      .fromJSDate(this.date)
      .setLocale("fr")
      .toLocaleString({ weekday: 'long', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  });

const UserSchema = new Schema({
  name: {type: String, required: true, maxlength: 100},
  steak_dates: [DateSchema]
});

// Virtual for user's url
UserSchema
  .virtual('url')
  .get(function () {
    return '/users/' + this._id;
  });

// Virtual for user's streaks
UserSchema
  .virtual('streaks')
  .get(function () {
    return this.steak_dates.map(({date}, index) => {
      // handle first date
      if (i === 0) return {date, days_since_last_date: 0};

      const thisDate = date;
      const lastDate = this.steak_dates[index - 1];
      const diffInDays = thisDate.diff(lastDate, 'day');

      return {date, diffInDays}
    })
  });


module.exports = mongoose.model('user', UserSchema);
