async function processData() {
  const results = {};
  const allRows = await Entry.find().sort(['domain','bot']);
  const domains = [...new Set(allRows.map(i=>i.domain))];
  const bots = ['tdt', 'monitor', 'detection'];
  for(const domain of domains) {
    results[domain] = {notes: []};
    for (const bot of bots) {
      results[domain][bot] = null;
    }
  }
  for(const row of allRows) {
    if (row.alert === 'force') continue;
    results[row.domain][row.bot] = (results[row.domain][row.bot] || 0) + row.severity;
    results[row.domain].notes.push(row.note);
  }
  for(const row of allRows) {
    if (row.alert !== 'force') continue;
    results[row.domain][row.bot] = row.severity;
    results[row.domain].notes = [row.note];
  }
  return results;
}

module.exports = {
  getAll: async function (req, res) {
    const allRecords = await Entry.find();
    return res.json(allRecords);
  },
  post: async function (req, res) {
    const existing = await Entry.findOne({
      domain: req.body.domain,
      bot: req.body.bot,
      alert: req.body.alert
    });
    if(existing) {
      await Entry.updateOne({id: existing.id})
        .set(req.body);
    } else {
      await Entry.create(req.body);
    }
    return res.ok();
  },
  status: async function (req, res) {
    console.log(req.query);
    const rows = [];
    const data = await processData();
    for(const domain in data) {
      if(req.query.domain && domain !== req.query.domain) {
        continue;
      }
      const r = {
        domain,
        notes: data[domain].notes.join(', '),
        tdt: (data[domain].tdt===undefined || data[domain].tdt===null) ? null : data[domain].tdt,
        detection: (data[domain].detection===undefined || data[domain].detection===null) ? null : data[domain].detection,
        monitor: (data[domain].monitor===undefined || data[domain].monitor===null) ? null : data[domain].monitor
      };
      rows.push(r);
    }

    return res.json(rows);
  },
  delete: async function (req, res) {
    const deleted = await Entry.destroyOne({id: req.param('id')});
    if(deleted) {
      return res.ok();
    } else {
      return res.notFound();
    }
  }
};




/*
  select
    domain
    ,sum(case when bot='tdt' then severity else 0 end) tdt
    ,sum(case when bot='monitor' then severity else 0 end) monitor
    ,sum(case when bot='detection' then severity else 0 end) detection
    ,group_concat(note) notes
  from
    bot_status.entry
  group by
    domain
 */
