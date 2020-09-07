#!/bin/bash
psql postgresql://localhost:5432/postgres -U admin -w -f drop_all.sql
