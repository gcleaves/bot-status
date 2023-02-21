module.exports = {
  attributes: {
    domain: { type: 'string', required: true },
    bot: {
      type: 'string',
      required: true,
      isIn: ['detection', 'monitor', 'tdt', 'lsm'],
    },
    alert: { type: 'string', required: true },
    note: { type: 'string', required: false },
    severity: {
      type: 'number',
      isInteger: true,
      required: true,
      min: 0,
      max: 10
    },
    deletedAt: { type: 'number', columnType: 'bigint', allowNull: true}
  },
};
