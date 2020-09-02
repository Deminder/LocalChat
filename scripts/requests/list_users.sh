#!/bin/bash
psql postgresql://localhost:5432/postgres -U admin -w secret \
	-c "select * from public.user"
	#-c "select u.id as id1_4_, u.enabled as enabled2_4_, u.password as password3_4_, u.username as username4_4_ from user u where u.username='admin'"
	#-c "select * from user"
