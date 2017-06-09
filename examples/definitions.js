module.exports = [
  {
    name: 'hello',
    path: '/hello',
    method: 'get',
    handler: (req, res) => res.json({ message: 'It works' }),
  },
  {
    name: 'login',
    path: '/login',
    method: 'post',
    handler: (req, res, { logged }) => {
      if (logged) {
        res.json({ message: 'OK' });
      } else {
        res.status(401).json({ message: 'UNAUTHORIZED' });
      }
    },
  },
];
