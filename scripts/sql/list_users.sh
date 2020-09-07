#!/bin/bash
psql postgresql://localhost:5432/postgres -U admin -w -c "select * from public.user"

