const express = require('express');
const router = express.Router();
const backups = require('../backups');
const fs = require('fs');
const { exec } = require('child_process');
const pino = require('pino');
const logger = pino({ prettyPrint: { colorize: true }, level: process.env.LOG_LEVEL || 'info', name: 'index' });

//Gets all the backups in the db
router.get('/:projectId', async (req, res) => {
  let backupData = await backups.getBackups(req.params.projectId).catch((err) => {
    logger.error('Backups information could not be recived when getting all backups', err);
  });

  //Returns all backup information
  res.send(backupData);
});

//Starts a backup in the database
router.get('/start/:projectId', async (req, res) => {
  let backupData = await backups.start(req.params.projectId).catch((err) => {
    logger.error('Backup information could not be recived when starting a backup by project id', err);
  });

  //Returns backup start data
  res.send(backupData);
});

//Returns one backup by backupId from database
router.get('/backup/:backupId', async (req, res) => {
  let backupData = await backups.backup(req.params.backupId).catch((err) => {
    logger.error('Backup information could not be recived when getting a single backup', err);
  });

  //Returns single backup
  res.send(backupData);
});

//sends the backup as a file to the user
router.get('/download/:backupId', async (req, res) => {
  //Query the database for the backup file
  let backupData = await backups.download(req.params.backupId).catch((err) => {
    logger.error('Backup information could not be recived when getting downloading a backup', err);
  });

  //creates a temp file for backups on the server so it can be sent to the frontend
  fs.writeFileSync(`temp/${req.params.backupId}.json`, JSON.stringify(backupData), (err) => {
    if (err) throw err;
  });

  //Sends the file that was created from the backup information
  res.download(`./temp/${req.params.backupId}.json`);
});

//Used for cleaning th backups on the server
router.get('/b/clean', async (res) => {
  exec('rm -rf ./temp/*', (err) => {
    if (err) {
      logger.error('backup could not be deleted from the server', err);
      res.send('Files could not be deleted!');
      return;
    }
    logger.debug('backups deleted');

    //If the files are deleted
    res.send('Files Deleted');
  });
});

module.exports = router;
